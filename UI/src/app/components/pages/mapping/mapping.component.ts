import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { IComment } from 'src/app/models/comment';
import { StateService } from 'src/app/services/state.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';

export interface ITable {
  id: number;
  area: string;
  name: string;
  rows: IRow[];
  visible: boolean;
  expanded: boolean;
}
export class Table {
  constructor(
    public id,
    public area,
    public name,
    public rows,
    public visible = true,
    public expanded = false
  ) {}
}

export interface IRow {
  id: number;
  tableId: number;
  name: string;
  type: string;
  area: string;
  comments: IComment[];
  visible: boolean;
  connections?: any[];
  htmlElement: any;
}
export class Row {
  constructor(
    public id,
    public tableId,
    public name,
    public type,
    public area,
    public comments,
    public visible = true,
    public connections = [],
    public htmlElement = null
    ) {}
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.dataService.initialize();
  }

  get hint() {
    return this.commonService.hintStatus;
  }
    
  get state() {
    return this.stateService.state;
  }
}
