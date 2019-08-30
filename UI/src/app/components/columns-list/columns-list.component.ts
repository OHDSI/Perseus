import { Component, OnInit, Input } from '@angular/core';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent implements OnInit {
  @Input() data: ITable[] | IRow[];

  constructor() {}

  ngOnInit() {}
}
