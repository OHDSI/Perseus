import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  columns: {field: string, name: string, className: string}[];

  constructor() { }

  ngOnInit(): void {
  }

  onSort(event: MouseEvent) {
  }
}
