import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from './grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

  @Input()
  data: {[key: string]: any}[];

  @Input()
  columns: Column[]

  @Input()
  height: string

  sortParams: {
    field: string
    order: string
  };

  requestInProgress = false;

  error: string;

  @Output()
  sort = new EventEmitter<{
    field: string;
    order: string
  }>()

  ngOnInit(): void {
  }

  onSort(field: string) {
    if (!this.sortParams || this.sortParams.field !== field || this.sortParams.order === 'desc') {
      this.sortParams = {
        field,
        order: 'asc'
      };
    } else {
      this.sortParams = {
        field,
        order: 'desc'
      };
    }

    this.sort.emit(this.sortParams)
  }
}
