import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StateService } from 'src/app/services/state.service';
import { ITable } from 'src/app/components/pages/mapping/mapping.component';
import { SampleDataPopupComponent } from 'src/app/components/popaps/sample-data-popup/sample-data-popup.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() title: string;
  @Input() table: ITable;
  @Input() columnList: any[];

  constructor(private stateService: StateService, public dialog: MatDialog) {}

  onOpen(e) {
    this.table.expanded = true;
  }

  onClose() {
    this.table.expanded = false;
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
