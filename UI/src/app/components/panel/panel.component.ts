import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CommonService } from 'src/app/services/common.service';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';
import { SampleDataPopupComponent } from '../popaps/sample-data-popup/sample-data-popup.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() table: ITable;

  get title() {
    return this.table.name;
  }

  get area() {
    return this.table.area;
  }

  get isTablelHasALink(): boolean {
    return this._isPanelHasALink;
  }
  private _isPanelHasALink: boolean;

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private stateService: StateService) {
  }

  ngOnInit() {
    this.bridgeService.connection.subscribe(_ => {
      this._isPanelHasALink = this.bridgeService.hasConnection(this.table);
    });
  }

  onOpen() {
    this.commonService.expanded(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, true);

    setTimeout(() => {
      this.bridgeService.refreshAll();
    }, 200);
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, false);

    setTimeout(() => {
      this.bridgeService.refreshAll();
      this.hideArrowsIfCorespondingTableasAreClosed(this.table);
    }, 200);

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

  setExpandedFlagOnSourceAndTargetTables(table: ITable, expanded: boolean) {
    this.stateService.state[table.area].tables
    .filter(t => t.id === table.id)
    .forEach(t => t.expanded = expanded);
  }

  hideArrowsIfCorespondingTableasAreClosed(table: ITable) {
    const corespondingTableNames = this.bridgeService.findCorrespondingTables(table);

    corespondingTableNames.forEach(name => {
      const correspondentTable = this.stateService.findTable(name);
      if (!correspondentTable.expanded && !table.expanded) {
        this.bridgeService.deleteTableArrows(table);
      }
    });
  }
}
