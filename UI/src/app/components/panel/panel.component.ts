import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SampleDataPopupComponent } from 'src/app/components/popaps/sample-data-popup/sample-data-popup.component';
import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { ITable } from 'src/app/models/table';

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
    private drawService: DrawService
  ) {}

  get title() {
    return this.table.name;
  }

  get area() {
    return this.table.area;
  }

  onOpen() {
    this.commonService.expanded(this.area);
    if (!this.drawService.listIsEmpty()) {
      this.drawService.fixConnectorsPosition();
    }
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.drawService.removeConnectorsBoundToTable(this.table);
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
