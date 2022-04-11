import { Component, Inject, OnInit } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from '@services/overlay/overlay-dialog-data';
import { DataService } from '@services/data.service';
import { StoreService } from 'src/app/services/store.service';
import { ColumnInfo, ColumnInfoStatus } from '@models/column-info/column-info';

@Component({
  selector: 'app-field-information',
  templateUrl: './column-info.component.html',
  styleUrls: [
    './column-info.component.scss',
    '../../../../grid/grid.component.scss'
  ]
})
export class ColumnInfoComponent implements OnInit {

  columnName: string;
  tableNames: string[];
  positionStrategyClass: string
  maxHeight: number;

  columnInfos: {
    [key: string]: {
      status: ColumnInfoStatus,
      value?: ColumnInfo
    }
  } = {};

  displayedColumns = ['value', 'frequency', 'percentage']

  height: string

  constructor(@Inject(OVERLAY_DIALOG_DATA) public payload: { columnName: string, tableNames: string[], positionStrategy: string, maxHeight: number },
              private dataService: DataService,
              private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.payload.tableNames
      .forEach(tableName => this.columnInfos[tableName] = {
        status: ColumnInfoStatus.LOADING
      });

    this.columnName = this.payload.columnName;
    this.tableNames = this.payload.tableNames;
    this.positionStrategyClass = `${this.payload.positionStrategy}-strategy`
    this.maxHeight = this.payload.maxHeight
    // Grid height
    this.height = `${this.payload.maxHeight - 195}px` // 175 - general info height, 20 - bottom padding

    this.loadFirst();
  }

  onTableChanged(index: number) {
    const tableName = this.tableNames[index];

    if (this.columnInfos[tableName].status === ColumnInfoStatus.LOADING) {
      this.dataService.getColumnInfo(this.storeService.scanReportName, tableName, this.columnName)
        .subscribe(result => {
          this.columnInfos[tableName].value = result;
          this.columnInfos[tableName].status = ColumnInfoStatus.READY;
        }, () => {
          this.columnInfos[tableName].status = ColumnInfoStatus.NO_INFO;
        });
    }
  }

  tooltip(value: string): string {
    return value.length < 255 ? value : value.slice(0, 255)
  }

  private loadFirst() {
    this.onTableChanged(0);
  }
}
