import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SampleDataPopupComponent } from 'src/app/components/popaps/sample-data-popup/sample-data-popup.component';
import { CommonService } from 'src/app/services/common.service';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';

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

  get isPanelHasALink(): boolean {
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

    this.stateService.state.source.tables
    .filter(table => table.id === this.table.id)
    .forEach(table => table.expanded = true);

    setTimeout(() => {
      this.bridgeService.refreshAll();
    });
  }

  onClose() {
    this.commonService.collapsed(this.area);

    this.stateService.state.source.tables
    .filter(table => table.id === this.table.id)
    .forEach(table => table.expanded = false);

    setTimeout(() => {
      this.bridgeService.refreshAll();
    });

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
}
