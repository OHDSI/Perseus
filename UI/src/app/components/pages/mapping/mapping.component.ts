import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { IComment } from 'src/app/models/comment';
import { StateService } from 'src/app/services/state.service';

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
  connetions?: {};
}
export class Row {
  constructor(
    public id,
    public name,
    public type,
    public area,
    public comments,
    public visible = true,
    public connections = {}
    ) {}
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private httpClient: HttpClient,
    private stateService: StateService
  ) {
  }

  ngOnInit() {
    this.httpClient
      .get<any>(`http://127.0.0.1:5000/get_cdm_schema?cdm_version=5.0.1`, {responseType: 'json'})
      .subscribe(data => this.initialize(data));
  }

  initialize(data) {
    const state = {
      source: {
        tables: []
      },
      target: {
        tables: []
      }
    };

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const area = 'source';
      const name = item.table_name;
      const rows = [];

      for (let j = 0; j < item.column_list.length; j++) {
        const id = j;
        const name = item.column_list[j].column_name;
        const type = item.column_list[j].column_type;
        const comments = [];
        const row = new Row(id, name, type, area, comments);

        rows.push(row);
      }

       state.source.tables.push(new Table(id, area, name, rows));
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const area = 'target';
      const name = item.table_name;
      const rows = [];

      for (let j = 0; j < item.column_list.length; j++) {
        const id = j;
        const name = item.column_list[j].column_name;
        const type = item.column_list[j].column_type;
        const comments = [];
        const row = new Row(id, name, type, area, comments);

        rows.push(row);
      }

       state.target.tables.push(new Table(id, area, name, rows));
    }

    this.stateService.initialize(state);
  }

  get hint() {
    const sourceExpandedStatus = this.stateService.state &&
      this.stateService.state.source.tables.some(table => table.expanded);
    const targetExpandedStatus = this.stateService.state &&
      this.stateService.state.target.tables.some(table => table.expanded);

    return sourceExpandedStatus && targetExpandedStatus;
  }

  get state() {
    return this.stateService.state;
  }
}
