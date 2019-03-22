import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-panel-table-column',
  templateUrl: './panel-table-column.component.html',
  styleUrls: ['./panel-table-column.component.scss']
})
export class PanelTableColumnComponent implements OnInit {
  @Input() columnName: string;
  @Input() columnType: string;

  constructor() { }

  ngOnInit() {
  }

}
