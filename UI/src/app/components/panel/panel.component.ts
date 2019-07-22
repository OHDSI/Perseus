import { Component, Input } from '@angular/core';
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
export class PanelComponent {
  @Input() table: ITable;

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private bridgeService: BridgeService,
  ) {}

  get title() {
    return this.table.name;
  }

  get area() {
    return this.table.area;
  }

  onOpen() {
    this.commonService.expanded(this.area);
    this.bridgeService.refresh(this.table);
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.bridgeService.hideArrows(this.table);
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
