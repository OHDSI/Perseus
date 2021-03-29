import { Component, Input, OnInit } from '@angular/core';
import { Column } from './grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input()
  data: {[key: string]: any}[];

  @Input()
  columns: Column[];

  @Input()
  height: string

  sort: {
    field: string;
    order: string
  };

  requestInProgress = false;

  error: string;

  constructor() { }

  ngOnInit(): void {
  }
}
