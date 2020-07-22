import { AfterViewInit, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { BridgeButtonData } from '../bridge-button/model/bridge-button-data';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { SampleDataPopupComponent } from '../popups/sample-data-popup/sample-data-popup.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

export class PanelBaseComponent implements OnInit, AfterViewInit {
  @Input() table: ITable;
  @Input() tabIndex: number;
  @Input() tables: ITable[];

  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() initialized = new EventEmitter();
  @Output() openTransform = new EventEmitter();

  @ViewChild('exppanelheader', { static: true }) panelHheader: any;

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
    private storeService: StoreService
  ) {
    this.initializing = true;
  }

  ngAfterViewInit() {
    this.initialized.emit();
    this.initializing = false;
  }

  ngOnInit() {
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
    this.setExpandedFlagOnSourceAndTargetTables(true);

    if (!this.initializing) {
      this.table.expanded = true;
      this.open.emit();
    }
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(false);

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

  setExpandedFlagOnSourceAndTargetTables(expanded: boolean) {
    this.storeService.state[this.area].filter(t => t.id === this.table.id).forEach(t => (t.expanded = expanded));
  }

  onCheckboxChange(event: MatCheckboxChange) {
    for (const row of this.table.rows) {
      const connections = this.bridgeService.findCorrespondingConnections(this.table, row);
      for (const connection of connections) {
        let action;
        if (!event.checked) {
          action = this.unLinkFields;
        } else {
          action = this.linkFields;
        }

        this.similarFieldsAction(connection, action.bind(this));
      }
    }
  }

  similarFieldsAction(connection, action) {
    this.tables.forEach(table => {
      if (table.name !== this.table.name) {
        table.rows.forEach(field => {
          if (field.name === connection[this.area].name) {
            if (this.area === 'source') {
              action(field, connection.target);
            } else {
              action(connection.source, field);
            }
          }
        });
      }
    });
  }

  linkFields(sourceField, targetField) {
    this.bridgeService.drawArrow(sourceField, targetField);
  }

  unLinkFields(sourceField, targetField) {
    const connectorId = this.bridgeService.getConnectorId(sourceField, targetField);
    this.bridgeService.deleteArrow(connectorId);
  }
}
