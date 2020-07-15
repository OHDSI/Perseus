import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ITable } from 'src/app/models/table';

@Component({
  selector: 'app-sample-data-popup',
  templateUrl: './sample-data-popup.component.html',
  styleUrls: ['./sample-data-popup.component.scss']
})
export class SampleDataPopupComponent implements OnInit {
  get dataSource(): any[] {
    return this._dataSource;
  }
  private _dataSource: any[];

  get title() {
    return this.table.name;
  }

  get subtitle() {
    const str = this.table.area;
    return str.charAt(0).toUpperCase() + str.slice(1) + ' table';
  }

  constructor(
    public dialogRef: MatDialogRef<SampleDataPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public table: ITable
  ) {}

  ngOnInit() {
    this._dataSource = this.getData();
  }

  getData() {
    const aRow = {};
    this.table.rows.forEach(row => {
      aRow[row.name] = 'no data';
    });

    return [aRow];
  }
}
