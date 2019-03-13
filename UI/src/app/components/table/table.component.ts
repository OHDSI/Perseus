import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Collapsed, Expanded, Linked } from 'src/app/store/actions/common.actions';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  items = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6'];

  ngOnInit() {}
}
