import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss']
})

export class PanelTableComponent implements OnInit {

  @Input() columnList: any[];

  displayedColumns: string[];
  dataSource = [];
   
  constructor() { }

  ngOnInit() {
  }
  

}
