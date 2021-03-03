import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { StoreService } from 'src/app/services/store.service';
import { Concept, IConceptOptions, ITableConcepts, ITableConceptsOptions, TableConcepts } from './model/concept';
import * as conceptMap from './../concept-fileds-list.json';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { SqlTransformationComponent } from '../sql-transformation/sql-transformation.component';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { LookupComponent } from '../vocabulary-transform-configurator/lookup/lookup.component';
import { LookupService } from 'src/app/services/lookup.service';
import { getConceptFieldNameByType } from 'src/app/services/utilites/concept-util';
import { BaseComponent } from '../../base/base.component';
import { createConceptFields } from 'src/app/services/utilites/concept-util';

@Component({
  selector: 'app-concept-transformation',
  templateUrl: './concept-transformation.component.html',
  styleUrls: [
    './concept-transformation.component.scss',
    './../vocabulary-transform-configurator/transform-config.component.scss'
  ]
})
export class ConceptTransformationComponent extends BaseComponent implements OnInit {

  @ViewChild('sqlTransfomation') sqlTransformation: SqlTransformationComponent;
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

  get displayedColumns() {
    return [ 'source_value', 'concept_id', 'source_concept_id', 'type_concept_id', 'remove_concept' ];
  }

  ngOnInit(): void {

    this.targetTableName = this.payload.arrow.target.tableName;
    this.conceptFields = this.conceptFieldsMap[ this.targetTableName ];
    this.targetCloneName = this.payload.arrow.target.cloneTableName;
    this.targetCondition = this.payload.arrow.condition;

    this.collectConnectedFields();

    this.conceptsTable = this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ];

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
        .filter(this.bridgeService.sourceConnectedToSameTargetByName(item, this.payload.arrow, this.payload.oppositeSourceTable));
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

    if (!this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ]) {

      const conceptTableOptions: ITableConceptsOptions = {
        lookup: {},
        conceptsList: []
      };
      this.conceptsTable = new TableConcepts(conceptTableOptions);
      Object.keys(this.connectedToConceptFields).forEach(key => {

        this.connectedToConceptFields[ key ].forEach(it => {
          const conceptIndex = this.connectedToConceptFields[ key ].indexOf(it);
          const fieldType = this.getConceptFieldType(it.target.name);
          if (!this.conceptsTable.conceptsList[ conceptIndex ]) {
            const fields = this.createConceptFields(this.targetCloneName, this.targetCondition);
            fields[fieldType].field = it.source.name;
            fields[fieldType].constantSelected = false;

            const conceptOptions: IConceptOptions = {
              id: conceptIndex,
              fields
            };

            this.conceptsTable.conceptsList.push(new Concept(conceptOptions));

          } else {
            this.conceptsTable.conceptsList[ conceptIndex ].fields[ fieldType ].field = it.source.name;
            this.conceptsTable.conceptsList[ conceptIndex ].fields[ fieldType ].constantSelected = false;
          }
        });
      });
    } else {
     Object.keys(this.connectedToConceptFields).forEach(key => {
       const fieldType = this.getConceptFieldType(key);
       this.removeDeletedFields(this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ].conceptsList, this.connectedToConceptFields[key].map(item => item.source.name), fieldType);
     });
     this.conceptsTable = this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ];

    }

    this.dataSource = new MatTableDataSource(this.conceptsTable.conceptsList.filter(it => it.fields['concept_id'].targetCloneName === this.targetCloneName));

    this.bridgeService.conceptSqlTransfomed$.
    pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.conceptsTable.conceptsList[this.selectedConceptId].fields[this.selectedCellType].sql = res;
    });
  }

  removeDeletedFields(conceptTable, connectedFields, fieldType) {
    conceptTable.forEach(concept => {
      if (!connectedFields.includes(concept.fields[ fieldType ].field)) {
        concept.fields[ fieldType ].field = '';
        concept.fields[ fieldType ].sql = '';
        concept.fields[ fieldType ].sqlApplied = false;
      }
    });
  }

  createConceptField(fields, fieldName: string, targetFieldName: string, clone?: string, condition?: string) {
    fields[ fieldName ] = {
      field: '',
      targetFieldName,
      targetCloneName: clone,
      sql: '',
      sqlApplied: false,
      constant: '',
      selected: false,
      constantSelected: true,
      condition,
      alreadySelected: false
    };
  }

  createConceptFields(clone?: string, condition?: string) {
    const fields = {};
    this.createConceptField(fields, 'concept_id', getConceptFieldNameByType('concept_id', this.connectedToConceptFields), clone, condition);
    this.createConceptField(fields, 'source_value', getConceptFieldNameByType('source_value', this.connectedToConceptFields), clone, condition);
    this.createConceptField(fields, 'source_concept_id', getConceptFieldNameByType('source_concept_id', this.connectedToConceptFields), clone, condition);
    this.createConceptField(fields, 'type_concept_id', getConceptFieldNameByType('type_concept_id', this.connectedToConceptFields), clone, condition);
    return fields;
  }

  onCellClick(cell: any, row: any) {

    while (cell.localName !== 'td') {
      cell = cell.parentElement;
    }
    const newselectedCellElement = cell;
    if (this.selectedCellElement !== newselectedCellElement) {
      if (this.selectedCellElement) {
        this.renderer.removeClass(this.selectedCellElement, 'concept-cell-selected');
        this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].selected = false;
      }
      this.selectedCellElement = newselectedCellElement;
      this.selectedCellType = this.selectedCellElement.classList.contains('concept_id') ? 'concept_id' :
        this.selectedCellElement.classList.contains('source_value') ? 'source_value' :
          this.selectedCellElement.classList.contains('source_concept_id') ? 'source_concept_id' : 'type_concept_id';
      this.renderer.addClass(this.selectedCellElement, 'concept-cell-selected');
      this.conceptsTable.conceptsList[ row.id ].fields[ this.selectedCellType ].selected = true;
      this.selectedConceptId = row.id;
      this.sqlTransformation.setConeptSqlValue(this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sql);
    }

  }

  getConceptFieldType(fieldName: string) {
    return fieldName.endsWith('type_concept_id') ? 'type_concept_id' :
    fieldName.endsWith('source_concept_id') ? 'source_concept_id' :
    fieldName.endsWith('source_value') ? 'source_value' :
    'concept_id';
  }

  toggleSqlTransformation(event: any) {
    this.conceptsTable.conceptsList[ this.selectedConceptId ].fields[ this.selectedCellType ].sqlApplied = event;
  }

  addConcept() {
    const fields = createConceptFields(this.conceptFields, this.targetCloneName, this.targetCondition);
    const conceptOptions: IConceptOptions = {
      id: this.conceptsTable.conceptsList.length,
      fields
    };
    this.conceptsTable.conceptsList.push(new Concept(conceptOptions));
    this.dataSource = new MatTableDataSource(this.conceptsTable.conceptsList);
  }

  removeConcept(row: any) {
    this.removeSelection();
    this.conceptsTable.conceptsList = this.conceptsTable.conceptsList.filter(item => item.id !== row.id);
    this.conceptsTable.conceptsList.forEach((item, index) => {
      item.id = index;
    });
    this.dataSource = new MatTableDataSource(this.conceptsTable.conceptsList.filter(it => it.fields[ 'concept_id' ].targetCloneName === this.targetCloneName));
  }

  add() {
    this.storeService.state.concepts[ `${this.targetTableName}|${this.payload.oppositeSourceTable}` ] = this.conceptsTable;

    if (this.payload.oppositeSourceTable === 'similar') {
      this.bridgeService.updateSimilarConcepts(this.payload.arrow);
    }

    if (this.lookupComponent.updatedSourceToStandard || this.lookupComponent.updatedSourceToSource) {

      this.updateLookupValue(this.lookupComponent.updatedSourceToStandard, 'source_to_standard');
      this.updateLookupValue(this.lookupComponent.updatedSourceToSource, 'source_to_source');
    }
    this.removeSelection();
    this.dialogRef.close();
  }

  updateLookupValue(updatedLookup: string, lookupType: string) {
    if (updatedLookup) {
      this.conceptsTable.lookup[ 'value' ] = updatedLookup;
      this.lookupService.saveLookup(this.conceptsTable.lookup, lookupType).subscribe(res => {
        console.log(res);
      });
    } else {
      this.lookupService.getLookup(this.conceptsTable.lookup[ 'originName' ], lookupType).subscribe(data => {
        if (data) {
          this.conceptsTable.lookup[ 'value' ] = data;
          this.lookupService.saveLookup(this.conceptsTable.lookup, lookupType).subscribe(res => {
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
