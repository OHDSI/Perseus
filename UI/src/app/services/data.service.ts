import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Row, RowOptions } from 'src/app/models/row';
import { ITable, ITableOptions, Table } from 'src/app/models/table';
import { EtlMappingForZipXmlGeneration } from '@models/etl-mapping-for-zip-xml-generation';
import { PerseusApiService } from './perseus/perseus-api.service';
import { StoreService } from './store.service';
import { BridgeService } from './bridge.service';
import { removeExtension } from '@utils/file';
import { ColumnInfo } from '@models/perseus/column-info';
import { COLUMNS_TO_EXCLUDE_FROM_TARGET } from '@app/app.constants';
import { Area } from '@models/area'
import { TableInfoResponse } from '@models/perseus/table-info-response'
import { PerseusXmlService } from '@services/perseus/perseus-xml.service'
import { MatDialog } from '@angular/material/dialog'
import { fromBlobError, openErrorDialog, parseHttpError } from '@utils/error'

@Injectable()
export class DataService {
  constructor(private perseusService: PerseusApiService,
              private storeService: StoreService,
              private bridgeService: BridgeService,
              private perseusXmlService: PerseusXmlService,
              private dialogService: MatDialog) {}

  private _normalize(data: TableInfoResponse[], area: Area): ITable[] {
    const tables = [];
    const uniqueIdentifierFields = [];

    for (let tableId = 0; tableId < data.length; tableId++) {
      const tableInfo = data[tableId];
      const tableName = tableInfo.table_name;
      const rows = [];

      for (let rowId = 0; rowId < tableInfo.column_list.length; rowId++) {
        const rowInfo = tableInfo.column_list[rowId]
        let unique: boolean;

        if (area === 'target') {
          const upperCaseColumnName = rowInfo.column_name.toUpperCase();
          const upperCaseTableName = tableInfo.table_name.toUpperCase()
          unique = upperCaseColumnName.indexOf('_ID') !== -1 &&
            upperCaseColumnName.replace('_ID', '') === upperCaseTableName;
          if (unique) {
            uniqueIdentifierFields.push(upperCaseColumnName);
          }
        }

        const rowOptions: RowOptions = {
          id: rowId,
          tableId,
          tableName,
          name: rowInfo.column_name,
          type: rowInfo.column_type,
          isNullable: rowInfo.is_column_nullable ? rowInfo.is_column_nullable.toUpperCase() === 'YES' : true,
          comments: [],
          uniqueIdentifier: unique,
          area
        };

        rows.push(new Row(rowOptions));
      }

      const tableOptions: ITableOptions = {
        id: tableId,
        area,
        name: tableName,
        rows
      };
      tables.push(new Table(tableOptions));
    }

    if (area === 'target') {
      this.bridgeService.updateRowsProperties(tables,
        (row) => uniqueIdentifierFields.includes(row.name.toUpperCase()),
        (row: any) => { row.uniqueIdentifier = true; }
      );
    }

    return tables;
  }

  getZippedXml(mapping: EtlMappingForZipXmlGeneration): Observable<File> {
    const reportName = removeExtension(this.storeService.scanReportName) ?? 'etl-mapping'
    return this.perseusXmlService.generateZipXml(reportName, mapping)
      .pipe(
        fromBlobError(),
        catchError(error => {
          openErrorDialog(this.dialogService, 'Failed to generate zip XML', parseHttpError(error))
          throw error
        })
      )
  }

  setCdmVersionAndGetTargetData(version: string): Observable<ITable[]> {
    const etlMappingId = this.storeService.state.etlMapping?.id
    this.storeService.addCdmVersion(version)
    const preRequest$ = etlMappingId ? this.perseusService.setCdmVersionToEtlMapping(etlMappingId, version) : of(null)
    return preRequest$.pipe(
      switchMap(() => this.perseusService.getTargetData(version)),
      map(data => {
        const filteredData = data.filter(it => !COLUMNS_TO_EXCLUDE_FROM_TARGET.includes(it.table_name.toUpperCase()));
        const tables = this.prepareTables(filteredData, Area.Target);
        this.prepareTargetConfig(filteredData);
        return tables;
      })
    )
  }

  getColumnInfo(etlMappingId: number, tableName: string, columnName: string): Observable<ColumnInfo> {
    return this.perseusService.getColumnInfo(etlMappingId, tableName, columnName)
      .pipe(
        map(info => {
          if (info.top_10[info.top_10.length - 1] === 'List truncated...') {
            info.top_10.pop();
          }

          return {
            name: info.Field,
            type: info.Type,
            uniqueValues: info['N unique values'],
            topValues: info.percentage
              .map((percentage, index) => ({
                value: info.top_10[index],
                frequency: info.frequency[index],
                percentage
              }))
          };
        })
      );
  }

  prepareTargetConfig(data): void {
    const targetConfig = {};
    data.map(table => {
      const tableName = table.table_name.toLowerCase();
      targetConfig[ tableName ] = {
        name: `target-${tableName}`,
        first: tableName,
        data: [ tableName ]
      };
    });

    this.storeService.add('targetConfig', targetConfig);
  }

  prepareTables(data: TableInfoResponse[], key: Area): ITable[] {
    const tables = this._normalize(data, key);
    this.storeService.add(key, tables);
    return tables;
  }
}
