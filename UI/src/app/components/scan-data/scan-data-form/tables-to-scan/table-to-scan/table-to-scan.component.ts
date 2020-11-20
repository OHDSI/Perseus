import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TableToScan } from '../../../model/table-to-scan';

@Component({
  selector: 'app-table-to-scan',
  templateUrl: './table-to-scan.component.html',
  styleUrls: ['./table-to-scan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableToScanComponent {
  @Input()
  private table: TableToScan;

  get tableName() {
    return this.table.tableName;
  }

  get selected() {
    console.log('Change detected');
    return this.table.selected;
  }

  set selected(selected: boolean) {
    if (this.table.selected !== selected) {
      this.table = {...this.table, selected};
    }
  }

  @Output()
  checkTable = new EventEmitter<string>();
}
