import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SampleDataPopupComponent } from 'src/app/components/popaps/sample-data-popup/sample-data-popup.component';
import { CommonService } from 'src/app/services/common.service';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

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
    private bridgeService: BridgeService) {
  }

  ngOnInit() {
    this.bridgeService.connection.subscribe(_ => {
      this._isPanelHasALink = this.bridgeService.hasConnection(this.table);
    });
  }

  onOpen() {
    this.commonService.expanded(this.area);

    setTimeout(() => {
      this.bridgeService.refreshAll();
    });
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.bridgeService.removeArrows(this.table);

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
