import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TableToScan } from '../../model/table-to-scan';

@Component({
  selector: 'app-tables-to-scan',
  templateUrl: './tables-to-scan.component.html',
  styleUrls: ['./tables-to-scan.component.scss', '../../scan-data-step.scss', '../../scan-data-normalize.scss', './popup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablesToScanComponent implements OnInit {

  @Input()
  tablesToScan: TableToScan[];

  constructor() {
  }

  ngOnInit(): void {
  }

  onCheckTable(tableName: string): void {
    this.tablesToScan = this.tablesToScan
      .map(table => table.tableName === tableName ? {tableName, selected: !table.selected} : table);
  }

  onSelectAll(): void {
    this.tablesToScan = this.tablesToScan
      .map(table => table.selected ? table : {tableName: table.tableName, selected: true});
  }

  onDeselectAll() {
    this.tablesToScan = this.tablesToScan
      .map(table => !table.selected ? table : {tableName: table.tableName, selected: false});
  }
}
