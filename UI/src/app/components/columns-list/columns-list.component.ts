import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent implements OnInit {
  @Input() data: ITable[] | IRow[];
  @Output() columnsSelected = new EventEmitter<string[]>();

  selectedColumns = [];
  constructor() {}

  ngOnInit() {}

  onSelectColumn(name: string) {
    const idx = this.selectedColumns.findIndex(x => x === name);
    if (idx > -1) {
      this.selectedColumns.splice(idx, 1);
    } else {
      this.selectedColumns.push(name);
    }

    this.selectedColumns = Object.assign([], this.selectedColumns);
    this.columnsSelected.emit(this.selectedColumns);
  }
}
