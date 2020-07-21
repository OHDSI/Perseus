import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { BridgeButtonData } from '../bridge-button/model/bridge-button-data';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { SampleDataPopupComponent } from '../popups/sample-data-popup/sample-data-popup.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PanelTableComponent } from './panel-table/panel-table.component';

@Component({
  selector: 'app-panel-source',
  templateUrl: './panel-source.component.html',
  styleUrls: ['./panel-source.component.scss']
})
export class PanelSourceComponent implements OnInit, AfterViewInit {
  @Input() table: ITable;
  @Input() tabIndex: number;
  @Input() tables: ITable[];

  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() initialized = new EventEmitter();
  @Output() openTransform = new EventEmitter();

  @ViewChild('exppanelheader', { static: true }) panelHheader: any;
  @ViewChild('panel') panel: PanelTableComponent;

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
    this.storeService.state[table.area].filter(t => t.id === table.id).forEach(t => (t.expanded = expanded));
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
        const similarField = table.rows.find(x => x.name === connection.source.name);
        if (similarField) {
          this.bridgeService.drawArrow(similarField, connection.target);
        }
      }
    }
  }

  unlinkSimilarFields(connection) {
    for (const table of this.tables) {
      if (table.name !== this.table.name) {
        const similarField = table.rows.find(x => x.name === connection.source.name);
        if (similarField) {
          const connectorId = this.bridgeService.getConnectorId(similarField, connection.target);
          this.bridgeService.deleteArrow(connectorId);
        }
      }
    }
  }
}
