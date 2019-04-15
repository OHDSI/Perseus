import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SampleDataPopupComponent } from 'src/app/components/popaps/sample-data-popup/sample-data-popup.component';
import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { Area } from 'src/app/components/area/area.component';
import { ITable } from 'src/app/models/table';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() area: Area;
  @Input() title: string;
  @Input() table: ITable;

  constructor(public dialog: MatDialog, private commonService: CommonService, private drawService: DrawService) {}

  onOpen() {
    this.commonService.expanded(this.area);
    this.drawService.fixConnectorsPosition();
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.drawService.removeConnectorsBoundToTable(this.table);
  }

  openSamleDataDialog(e) {
      e.preventDefault();
      e.stopPropagation();
    
    const dialogRef = this.dialog.open(SampleDataPopupComponent, {
      width: '1021px',
      height: '696px',
      data: this.table
    });
  }
}
