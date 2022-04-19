import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { uniq } from 'src/app/infrastructure/utility';
import { ITable } from 'src/app/models/table';
import { TransformationDialogData } from '@models/transformation-dialog-data';
import { IConnector } from '@models/connector';
import { BridgeService } from 'src/app/services/bridge.service';
import { PerseusApiService } from '@services/perseus/perseus-api.service';
import { Area } from 'src/app/models/area';
import { StoreService } from 'src/app/services/store.service';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { addSemicolon } from '@utils/text-util';
import { SqlTransformationComponent } from '@mapping/sql-transformation/sql-transformation.component';
import { openErrorDialog, parseHttpError } from '@utils/error';
import { Observable } from 'rxjs';
import { LookupComponent } from '@mapping/lookup/lookup.component';
import { DeleteWarningComponent } from '@popups/delete-warning/delete-warning.component';
import { Lookup } from '@models/perseus/lookup'
import { TransformationDialogResult } from '@models/transformation-dialog-result'
import { LookupType } from '@models/perseus/lookup-type'

@Component({
  selector: 'app-transform-config',
  templateUrl: './transform-config.component.html',
  styleUrls: [ './transform-config.component.scss' ]
})
export class TransformConfigComponent implements OnInit {
  sourceTables: ITable[];
  sourceFields: string
  sourceType: string

  connector: IConnector;
  titleInfo: string;

  tab: string;
  tabIndex = 0

  lookupType: LookupType;
  lookup: Lookup;
  lookupDisabled: boolean;

  sql: SqlForTransformation = {};

  @ViewChild('sqlTransformationComponent')
  sqlTransformationComponent: SqlTransformationComponent

  @ViewChild('lookupComponent')
  lookupComponent: LookupComponent

  constructor(
    @Inject(MAT_DIALOG_DATA) public payload: TransformationDialogData,
    public dialogRef: MatDialogRef<TransformConfigComponent, TransformationDialogResult>,
    private matDialog: MatDialog,
    private storeService: StoreService,
    private bridgeService: BridgeService,
    private httpService: PerseusApiService
  ) {
  }

  get resultSql() {
    return this.sqlTransformationComponent.sqlForTransformation
  }

  get dirty() {
    return this.sqlTransformationComponent.dirty || (!this.lookupDisabled && this.lookupComponent.dirty)
  }

  get applyDisabled() {
    return (this.tabIndex === 0 && this.sqlTransformationComponent?.invalid) ||
      (this.tabIndex === 1 && !!this.lookupComponent?.invalid)
  }

  ngOnInit() {
    this.lookup = this.payload.lookup ?? {}
    this.lookupType = this.payload.lookupType;
    if (this.lookup.name) {
      this.lookup.value = this.lookup.name
    }
    this.sql = {...this.payload.sql}
    this.tab = this.payload.tab;
    this.tabIndex = this.tab === 'Lookup' ? 1 : 0

    const { arrowCache, connector } = this.payload;
    const target = arrowCache[connector.id].connector.target
    const sourceFields = Object.values(arrowCache)
      .filter(this.bridgeService.sourceConnectedToSameTarget(target, true))
      .map(({source}) => ({name: source.name, type: source.type}));
    this.connector = connector;
    this.sourceTables = this.storeService.state.source;
    this.sourceFields = [...new Set(sourceFields.map(field => field.name))].join(',')
    this.titleInfo = `${this.sourceFields} - ${connector.target.name}`;
    this.lookupDisabled = !target.name.endsWith('concept_id');
    if (sourceFields.length) {
      this.sourceType = sourceFields[0].type
    }
  }

  onApply() {
    const sql = this.resultSql
    const lookup = this.lookupComponent.updatedLookup
    this.validateSql(sql.name)
      .subscribe(() => {
          this.dialogRef.close({sql, lookup})
        },
        error => openErrorDialog(this.matDialog, 'Sql error', parseHttpError(error))
      )
  }

  validateSql(sql: string): Observable<void> {
    const sqlTransformation = [];
    if (this.connector.source.tableName === 'similar') {
      const similarLinks = this.bridgeService.findSimilarLinks(this.connector, Area.Source, Area.Target);
      const tables = [];
      similarLinks.forEach(item => {
          const tableName = this.bridgeService.arrowsCache[item].source.tableName;
          if (tableName !== 'similar') {
            tables.push(this.getViewSql(sql, tableName));
          }
        }
      );
      uniq(tables).forEach(it => sqlTransformation.push(addSemicolon(it)));
    } else {
      sqlTransformation.push(addSemicolon(this.getViewSql(sql, this.connector.source.tableName)));
    }
    return this.httpService.validateSql({ sql: sqlTransformation })
  }

  cancel() {
    if (this.dirty) {
      const dialogParams = {
        closeOnNavigation: false,
        disableClose: false,
        panelClass: 'warning-dialog',
        data: {
          title: 'changes',
          message: 'Unsaved changes will be deleted',
        }
      }
      this.matDialog.open(DeleteWarningComponent, dialogParams)
        .afterClosed()
        .subscribe(res => res && this.dialogRef.close())
    } else {
      this.dialogRef.close();
    }
  }

  onTabIndexChanged(index: number) {
    this.tabIndex = index
    if (index === 0) {
      this.sqlTransformationComponent.refresh()
    } else {
      this.lookupComponent.refresh()
    }
  }

  private getViewSql(sql: string, tableName: string) {
    let viewSql = this.sourceTables
      .find(item => item.name === tableName).sql
      .replace(/^(\r\n)|(\n)/gi, ' ')
      .replace(/\s\s+/g, ' ');
    if (viewSql) {
      viewSql = `WITH ${tableName} AS (${viewSql}) `;
    }
    return `${viewSql} SELECT ${sql} FROM ${tableName}`;
  }
}
