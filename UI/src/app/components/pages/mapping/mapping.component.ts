import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { IComment } from 'src/app/models/comment';
import { StateService } from 'src/app/services/state.service';
import { DataService } from 'src/app/services/data.service';

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
  name: string;
  type: string;
  area: string;
  comments: IComment[];
  visible: boolean;
  connections?: any[];
}
export class Row {
  constructor(
    public id,
    public name,
    public type,
    public area,
    public comments,
    public visible = true,
    public connections = []
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
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.dataService.initialize();
  }

  get hint() {
    if (!this.stateService.state) {
      return;
    }

    const sourceExpandedStatus = this.stateService.state.source.tables.some(table => table.expanded);
    const targetExpandedStatus = this.stateService.state.target.tables.some(table => table.expanded);

    return sourceExpandedStatus && targetExpandedStatus;
  }

  get state() {
    return this.stateService.state;
  }
}
