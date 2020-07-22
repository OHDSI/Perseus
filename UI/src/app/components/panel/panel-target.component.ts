import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { PanelTableComponent } from './panel-table/panel-table.component';
import { PanelBaseComponent } from './panel-base.component';

const groupsConf = {
  common: [
    'PERSON_ID',
    'VISIT_OCCURRENCE_ID',
    'VISIT_DETAIL_ID',
    'PROVIDER_ID',
    'START_DATE',
    'START_DATETIME',
    'END_DATE',
    'END_DATETIME',
    'CONDITION_START_DATE',
    'CONDITION_START_DATETIME',
    'CONDITION_END_DATE',
    'CONDITION_END_DATETIME',
    'DRAG_EXPLOSURE_START_DATE',
    'DRAG_EXPLOSURE_START_DATETIME',
    'DRAG_EXPLOSURE_END_DATE',
    'DRAG_EXPLOSURE_END_DATETIME',
    'DEVICE_EXPLOSURE_START_DATE',
    'DEVICE_EXPLOSURE_START_DATETIME',
    'DEVICE_EXPLOSURE_END_DATE',
    'DEVICE_EXPLOSURE_END_DATETIME',
    'MEASUREMENT_DATE',
    'MEASUREMENT_DATETIME',
    'OBSERVATION_DATE',
    'OBSERVATION_DATETIME',
    'PROCEDURE_DATE',
    'PROCEDURE_DATETIME',
    'SPECIMEN_DATE',
    'SPECIMEN_DATETIME'
  ],
  concept: [
    'CONCEPT_ID',
    'SOURCE_VALUE',
    'SOURCE_CONCEPT_ID',
    'TYPE_CONCEPT_ID',
    'CONDITION_CONCEPT_ID',
    'CONDITION_SOURCE_VALUE',
    'CONDITION_SOURCE_CONCEPT_ID',
    'CONDITION_TYPE_CONCEPT_ID',
    'DRAG_CONCEPT_ID',
    'DRAG_SOURCE_VALUE',
    'DRAG_SOURCE_CONCEPT_ID',
    'DRAG_TYPE_CONCEPT_ID',
    'DEVICE_CONCEPT_ID',
    'DEVICE_SOURCE_VALUE',
    'DEVICE_SOURCE_CONCEPT_ID',
    'DEVICE_TYPE_CONCEPT_ID',
    'MEASUREMENT_CONCEPT_ID',
    'MEASUREMENT_SOURCE_VALUE',
    'MEASUREMENT_SOURCE_CONCEPT_ID',
    'MEASUREMENT_TYPE_CONCEPT_ID',
    'OBSERVATION_CONCEPT_ID',
    'OBSERVATION_SOURCE_VALUE',
    'OBSERVATION_SOURCE_CONCEPT_ID',
    'OBSERVATION_TYPE_CONCEPT_ID',
    'PROCEDURE_CONCEPT_ID',
    'PROCEDURE_SOURCE_VALUE',
    'PROCEDURE_SOURCE_CONCEPT_ID',
    'PROCEDURE_TYPE_CONCEPT_ID',
    'SPECIMEN_CONCEPT_ID',
    'SPECIMEN_SOURCE_VALUE',
    'SPECIMEN_TYPE_CONCEPT_ID'
  ]
};

@Component({
  selector: 'app-panel-target',
  templateUrl: './panel-target.component.html',
  styleUrls: ['./panel-target.component.scss']
})
export class PanelTargetComponent extends PanelBaseComponent implements OnInit {
  @ViewChild('conceptPanel') conceptPanel: PanelTableComponent;
  @ViewChild('commonPanel') commonPanel: PanelTableComponent;
  @ViewChild('individualPanel') individualPanel: PanelTableComponent;

  constructor(
    public dialog: MatDialog,
    commonService: CommonService,
    bridgeService: BridgeService,
    bridgeButtonService: BridgeButtonService,
    storeService: StoreService
  ) {
    super(dialog, commonService, bridgeService, bridgeButtonService, storeService);
  }

  concept: ITable;
  common: ITable;
  individual: ITable;

  ngOnInit() {
    super.ngOnInit();

    const concept = [];
    const common = [];
    const individual = [];

    for (const item of this.table.rows) {
      if (groupsConf['concept'].includes(item.name)) {
        concept.push(item);
      } else if (groupsConf['common'].includes(item.name)) {
        common.push(item);
      } else {
        individual.push(item);
      }
    }

    this.concept = Object.assign({}, this.table);
    this.concept.rows = concept;
    this.concept.expanded = concept.length ? true : false;
    this.common = Object.assign({}, this.table);
    this.common.rows = common;
    this.common.expanded = common.length ? true : false;
    this.individual = Object.assign({}, this.table);
    this.individual.rows = individual;
    this.individual.expanded = individual.length ? true : false;
  }
}
