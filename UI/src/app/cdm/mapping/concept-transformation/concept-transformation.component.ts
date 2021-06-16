import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { StoreService } from 'src/app/services/store.service';
import { Concept, IConceptOptions, ITableConcepts } from './model/concept';
import * as conceptMap from '../concept-fileds-list.json';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { LookupComponent } from '../vocabulary-transform-configurator/lookup/lookup.component';
import { LookupService } from 'src/app/services/lookup.service';
import { BaseComponent } from '@shared/base/base.component';
import { createConceptFields, updateConceptsIndexes, updateConceptsList } from 'src/app/utils/concept-util';
import { ConceptTransformationService } from 'src/app/services/concept-transformation.sevice';
import { SqlTransformationComponent } from '@mapping/sql-transformation/sql-transformation.component';
import { SqlForTransformation } from '@app/models/transformation/sql-for-transformation';

@Component({
  selector: 'app-concept-transformation',
  templateUrl: './concept-transformation.component.html',
  styleUrls: [
    './concept-transformation.component.scss',
    '../vocabulary-transform-configurator/transform-config.component.scss'
  ]
})
export class ConceptTransformationComponent extends BaseComponent implements OnInit {

  @ViewChild('sqlTransformation') sqlTransformation: SqlTransformationComponent;
  @ViewChild('lookupComponent') lookupComponent: LookupComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public payload: any,
              private storeService: StoreService,
              private bridgeService: BridgeService,
              private renderer: Renderer2,
              private overlayService: OverlayService,
              public dialogRef: MatDialogRef<ConceptTransformationComponent>,
              private lookupService: LookupService
  ) {
    super();
  }

  data;
  dataSource;
  concepts = [ new Concept(), new Concept() ];

  conceptsTable: ITableConcepts;
  targetTableName;
  selectedCellElement;
  conceptFieldsMap = (conceptMap as any).default;
  connectedToConceptFields = {};
  conceptFields = [];
  selectedCellType = '';
  selectedConceptId: number;
  reducedSqlArea = true;
  lookupType = 'source_to_standard';
  targetCloneName: string;
  targetCondition: string;
  row: any;

  sql: SqlForTransformation = {}
  sourceFields = ''

  get displayedColumns() {
    return [ 'source_value', 'concept_id', 'source_concept_id', 'type_concept_id', 'remove_concept' ];
  }

  get sqlForTransformation(): SqlForTransformation {
    return {
      ...this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sqlForTransformation
    }
  }

  set sqlForTransformation(sqlObject: SqlForTransformation) {
    this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sqlForTransformation = sqlObject;
  }

  set conceptSql(sqlString: string) {
    this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sql = sqlString
  }

  set cellSelected(selected: boolean) {
    this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].selected = selected;
  }

  get conceptField() {
    return this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].field;
  }

  ngOnInit(): void {
    this.targetTableName = this.payload.row.tableName;
    this.conceptFields = this.conceptFieldsMap[ this.targetTableName ];
    this.targetCloneName = this.payload.row.cloneTableName;
    this.targetCondition = this.payload.row.condition;
    this.row = this.payload.row;

    this.collectConnectedFields();

    if (!this.storeService.state.concepts[`${this.targetTableName}|${this.payload.oppositeSourceTable}`]) {
      const conceptService = new ConceptTransformationService(this.targetTableName, this.payload.oppositeSourceTable, this.storeService.state.concepts);
      conceptService.addNewConceptTable();
    }

    this.conceptsTable = cloneDeep(this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ]);

    if ( this.conceptsTable.lookup['name'] ) {
      const copiedLookup = cloneDeep(this.conceptsTable.lookup);
      const lookups = {};
      this.targetCloneName ? lookups[ this.targetCloneName] = copiedLookup : lookups['Default'] = copiedLookup;
      this.conceptsTable.lookup = lookups;
    } else {
      if (!this.targetCloneName && this.conceptsTable.lookup['Default'] || !this.conceptsTable.lookup[this.targetCloneName]) {
        const copiedLookup = cloneDeep(Object.values(this.conceptsTable.lookup)[0])
        this.targetCloneName ? this.conceptsTable.lookup[ this.targetCloneName] = copiedLookup : this.conceptsTable.lookup['Default'] = copiedLookup;
      }
    }

    this.dataSource = new MatTableDataSource(this.conceptsTable.conceptsList
      .filter(it => it.fields[ 'concept_id' ].targetCloneName === this.targetCloneName));

    this.bridgeService.conceptSqlTransfomed$.
      pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sql = res;
      });
  }

  collectConnectedFields() {
    this.connectedToConceptFields = {};
    this.conceptFields.forEach(item => {
      const connectedFields = [];

      const links = Object.values(this.bridgeService.arrowsCache)
        .filter(this.bridgeService.sourceConnectedToSameTargetByName(item, this.row, this.payload.oppositeSourceTable));
      links.forEach(link => {
        if (link.source.grouppedFields && link.source.grouppedFields.length) {
          link.source.grouppedFields.forEach(it => {
            const ungrouppedField = cloneDeep(link);
            ungrouppedField.source = it;
            connectedFields.push(ungrouppedField);
          });
        } else {
          connectedFields.push(link);
        }
      });
      this.connectedToConceptFields[ item ] = connectedFields;
    });
  }

  onCellClick(cell: any, row: any) {
    while (cell.localName !== 'td') {
      cell = cell.parentElement;
    }
    const newselectedCellElement = cell;
    if (this.selectedCellElement !== newselectedCellElement) {
      if (this.selectedCellElement) {
        this.renderer.removeClass(this.selectedCellElement, 'concept-cell-selected');
        this.cellSelected = false;
        this.saveConceptSqlransformation();
      }
      this.selectedCellElement = newselectedCellElement;
      this.selectedCellType = this.selectedCellElement.classList.contains('concept_id') ? 'concept_id' :
        this.selectedCellElement.classList.contains('source_value') ? 'source_value' :
          this.selectedCellElement.classList.contains('source_concept_id') ? 'source_concept_id' : 'type_concept_id';
      this.renderer.addClass(this.selectedCellElement, 'concept-cell-selected');
      this.selectedConceptId = row.id;
      this.cellSelected = true;
      this.sql = this.sqlForTransformation;
      this.sourceFields = this.conceptField;
    }
  }

  getLookup() {
    return this.targetCloneName ? this.conceptsTable.lookup[this.targetCloneName] : this.conceptsTable.lookup['Default'];
  }

  getLookupName() {
    if (!this.conceptsTable.lookup[this.targetCloneName] && !this.conceptsTable.lookup['Default'] ) {
      return this.conceptsTable.lookup['name'];
    }
    return this.targetCloneName ? this.conceptsTable.lookup[this.targetCloneName]['name'] : this.conceptsTable.lookup['Default']['name'];
  }

  toggleSqlTransformation(event: any) {
    this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sqlApplied = event;
  }

  onTabIndexChanged(index: any) {
    if (index === 1) {
      this.lookupComponent.refreshCodeMirror(this.lookupComponent.name);
    }
  }

  addConcept() {
    const fields = createConceptFields(this.conceptFields, this.targetCloneName, this.targetCondition);
    const conceptOptions: IConceptOptions = {
      id: this.conceptsTable.conceptsList.length,
      fields
    };
    this.conceptsTable.conceptsList.push(new Concept(conceptOptions));
    this.dataSource = new MatTableDataSource(this.conceptsTable.conceptsList
      .filter(it => it.fields[ 'concept_id' ].targetCloneName === this.targetCloneName));
  }

  removeConcept(row: any) {
    this.removeSelection();
    this.conceptsTable.conceptsList = this.conceptsTable.conceptsList.filter(item => item.id !== row.id);
    this.conceptsTable.conceptsList.forEach((item, index) => {
      item.id = index;
    });
    this.dataSource = new MatTableDataSource(this.conceptsTable.conceptsList.filter(it => it.fields[ 'concept_id' ].targetCloneName === this.targetCloneName));
  }

  saveConceptSqlransformation(){
    if (this.selectedCellType) {
      this.conceptSql = this.sqlTransformation.sqlForTransformation.name;
      this.sqlForTransformation = this.sqlTransformation.sqlForTransformation;
    }
  }

  add() {
    this.saveConceptSqlransformation();

    this.removeSelection();

    this.conceptsTable.conceptsList = updateConceptsList(this.conceptsTable.conceptsList);
    updateConceptsIndexes(this.conceptsTable.conceptsList);
    this.bridgeService.updateConceptArrowTypes(this.targetTableName, this.payload.oppositeSourceTable, this.targetCloneName)

    this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ] = this.conceptsTable;

    if (this.payload.oppositeSourceTable === 'similar') {
      this.bridgeService.updateSimilarConcepts(this.row);
    }

    if (this.lookupComponent.updatedSourceToStandard || this.lookupComponent.updatedSourceToSource) {

      this.updateLookupValue(this.lookupComponent.updatedSourceToStandard, 'source_to_standard');
      this.updateLookupValue(this.lookupComponent.updatedSourceToSource, 'source_to_source');
    }
    this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ] = this.conceptsTable
    this.dialogRef.close();
  }

  updateLookupValue(updatedLookup: string, lookupType: string) {
    if (updatedLookup) {
      this.conceptsTable.lookup[ 'value' ] = updatedLookup;
      this.lookupService.saveLookup(this.conceptsTable.lookup, lookupType, this.getLookupName()).subscribe(res => {
        console.log(res);
      });
    } else {
      this.lookupService.getLookup(this.conceptsTable.lookup[ 'originName' ], lookupType).subscribe(data => {
        if (data) {
          this.conceptsTable.lookup[ 'value' ] = data;
          this.lookupService.saveLookup(this.conceptsTable.lookup, lookupType, this.getLookupName()).subscribe(res => {
            console.log(res);
          });

        }
      });
    }
  }

  removeSelection() {
    if (this.selectedCellElement) {
      this.renderer.removeClass(this.selectedCellElement, 'concept-cell-selected');
      this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].selected = false;
      this.selectedCellElement = undefined;
    }
  }

  close() {
    this.removeSelection();
    this.dialogRef.close();
  }
}
