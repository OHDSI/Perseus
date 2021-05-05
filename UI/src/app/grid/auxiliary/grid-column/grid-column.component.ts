import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column, Sort } from '../../../models/grid/grid';

@Component({
  selector: '[perseus-grid-column]',
  templateUrl: './grid-column.component.html',
  styleUrls: ['./grid-column.component.scss']
})
export class GridColumnComponent {

  @Input()
  column: Column

  @Input()
  sortable: boolean

  @Input()
  sortParams: Sort

  @Output()
  sort = new EventEmitter<string>()

  onSort(field: string) {
    this.sort.emit(field)
  }
}
