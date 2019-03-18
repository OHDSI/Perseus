import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Collapsed, Expanded, Linked } from 'src/app/store/actions/common.actions';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() title: string;

  ngOnInit() {}
}
