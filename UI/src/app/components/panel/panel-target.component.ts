import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { CommonService } from 'src/app/services/common.service';
import { StateService } from 'src/app/services/state.service';
import { BridgeButtonData } from '../bridge-button/model/bridge-button-data';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { SampleDataPopupComponent } from '../popups/sample-data-popup/sample-data-popup.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PanelTableComponent } from './panel-table/panel-table.component';

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
export class PanelTargetComponent implements OnInit, AfterViewInit {
  @Input() table: ITable;
  @Input() tabIndex: number;
  @Input() tables: ITable[];

  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() initialized = new EventEmitter();
  @Output() openTransform = new EventEmitter();

  @ViewChild('exppanelheader', { static: true }) panelHheader: any;
  @ViewChild('conceptPanel') conceptPanel: PanelTableComponent;
  @ViewChild('commonPanel') commonPanel: PanelTableComponent;
  @ViewChild('individualPanel') individualPanel: PanelTableComponent;

  get title() {
    return this.table.name;
  }

  get area() {
    return this.table.area;
  }

  initializing: boolean;

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private bridgeButtonService: BridgeButtonService,
    private stateService: StateService
  ) {
    this.initializing = true;
  }

  concept: ITable;
  common: ITable;
  individual: ITable;

  ngAfterViewInit() {
    this.initialized.emit();
    this.initializing = false;
  }

  ngOnInit() {
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

    this.bridgeService.deleteAll.subscribe(_ => {
      this.panelHheader._element.nativeElement.classList.remove(
        'table-has-a-link-true'
      );
    });

    this.bridgeService.connection.subscribe(_ => {
      if (this.bridgeService.isTableConnected(this.table)) {
        this.panelHheader._element.nativeElement.classList.add(
          'table-has-a-link-true'
        );
      }
    });
  }

  onOpen() {
    this.commonService.expanded(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, true);

    if (!this.initializing) {
      this.table.expanded = true;
      this.open.emit();
    }
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, false);

    if (!this.initializing) {
      this.table.expanded = false;
      this.close.emit();
    }
  }

  openSampleDataDialog(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dialog.open(SampleDataPopupComponent, {
      width: '1021px',
      height: '696px',
      data: this.table
    });
  }

  onOpenTransfromDialog(event: any) {
    const {row, element} = event;

    const connections = this.bridgeService.findCorrespondingConnections(
      this.table,
      row
    );
    if (connections.length > 0) {
      const payload: BridgeButtonData = {
        connector: connections[0].connector,
        arrowCache: this.bridgeService.arrowsCache
      };

      this.bridgeButtonService.init(payload, element);
      this.bridgeButtonService.openRulesDialog();
    }
  }

  setExpandedFlagOnSourceAndTargetTables(table: ITable, expanded: boolean) {
    this.stateService.state[table.area].tables
      .filter(t => t.id === table.id)
      .forEach(t => (t.expanded = expanded));
  }

  onCheckboxChange(event: MatCheckboxChange) {
    for (const row of this.table.rows) {
      const connections = this.bridgeService.findCorrespondingConnections(this.table, row);
      for (const connection of connections) {
        if (!event.checked) {
          this.unlinkSimilarFields(connection);
        } else {
          this.linkSimilarFields(connection);
        }
      }
    }
  }

  linkSimilarFields(connection) {
    for (const table of this.tables) {
      if (table.name !== this.table.name) {
        const similarField = table.rows.find(x => x.name === connection.target.name);
        if (similarField) {
          this.bridgeService.drawArrow(connection.source, similarField);
        }
      }
    }
  }

  unlinkSimilarFields(connection) {
    for (const table of this.tables) {
      if (table.name !== this.table.name) {
        const similarField = table.rows.find(x => x.name === connection.target.name);
        if (similarField) {
          const connectorId = this.bridgeService.getConnectorId(connection.source, similarField);
          this.bridgeService.deleteArrow(connectorId);
        }
      }
    }
  }
}
