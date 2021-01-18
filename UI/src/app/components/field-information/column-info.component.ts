import { Component, Inject, OnInit } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from '../../services/overlay/overlay-dialog-data';
import { DataService } from '../../services/data.service';

export interface ValueInfo {
  value: string;
  frequency: string;
  percentage: string;
}

export interface ColumnInfo {
  type: string;
  uniqueValues: string;
  topValues: ValueInfo[];
}

@Component({
  selector: 'app-field-information',
  templateUrl: './column-info.component.html',
  styleUrls: ['./column-info.component.scss']
})
export class ColumnInfoComponent implements OnInit {

  columnName: string;

  tableNames: string[];

  columnInfos: {[key: string]: ColumnInfo} = {};

  constructor(@Inject(OVERLAY_DIALOG_DATA) public payload: {columnName: string, tableNames: string[]},
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.columnName = this.payload.columnName;
    this.tableNames = this.payload.tableNames;

    this.loadFirst();
  }

  onTableChanged(index: number) {
    const tableName = this.tableNames[index];

    if (!this.columnInfos[tableName]) {
      this.dataService.getColumnInfo(tableName, this.columnName)
        .subscribe(result => {
          this.columnInfos[tableName] = result;
        });
    }
  }

  private loadFirst() {
    this.onTableChanged(0);
  }
}
