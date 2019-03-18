import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-panel-content-column',
  templateUrl: './panel-content-column.component.html',
  styleUrls: ['./panel-content-column.component.scss']
})
export class PanelContentColumnComponent implements OnInit {
  @Input() columnName: string;
  @Input() columnType: string;

  constructor() { }

  ngOnInit() {
  }

}
