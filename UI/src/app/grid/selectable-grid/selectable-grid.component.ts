import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GridComponent } from '../grid.component';

@Component({
  selector: 'app-selectable-grid',
  templateUrl: './selectable-grid.component.html',
  styleUrls: [
    '../grid.component.scss',
    './selectable-grid.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectableGridComponent extends GridComponent implements OnInit {

  @Input()
  data: {
    selected: boolean,
    [key: string]: any
  }[]

  @Input()
  sortable = false

  checkedAll: boolean

  ngOnInit(): void {
    this.displayedColumns = [
      '__select__',
      ...this.columns.map(col => col.field)
    ]
    this.setCheckedAll()
  }

  select(row: {selected: boolean; [key: string]: any}) {
    row.selected = !row.selected
    this.setCheckedAll()
  }

  selectAll() {
    this.checkedAll = !this.checkedAll
    this.data.forEach(row => row.selected = this.checkedAll)
  }

  private setCheckedAll() {
    this.checkedAll = this.data.every(row => row.selected)
  }
}
