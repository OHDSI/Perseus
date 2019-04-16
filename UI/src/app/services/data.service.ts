import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { StateService } from './state.service';
import { Row } from 'src/app/models/row';
import { Table } from 'src/app/models/table';

@Injectable()
export class DataService {
  constructor(
    private httpClient: HttpClient,
    private stateService: StateService
    ) {}

  initialize() {
    this._initSourceData();
    this._initTargetData();
  }

  _initSourceData() {
    const path_to_source = 'assets/source.json';
    this.httpClient.get<any>(path_to_source)
      .subscribe(data => this._normalize(data, 'source')
        .subscribe(tables => this.stateService.initialize(tables, 'source')));
  }

  _initTargetData() {
    const path_to_target = 'assets/target.json';
    this.httpClient.get<any>(path_to_target)
      .subscribe(data => this._normalize(data, 'target')
        .subscribe(tables => this.stateService.initialize(tables, 'target')));
  }

  _normalize(data, area) {
    const tables = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const name = item.table_name;
      const rows = [];

      for (let j = 0; j < item.column_list.length; j++) {
        const id = j;
        const tableId = i;
        const name = item.column_list[j].column_name;
        const type = item.column_list[j].column_type;
        const comments = [];
        const values = Array(20).fill(1).map(n =>  Math.floor(Math.random() * 100) + 1 );
        const row = new Row(id, tableId, name, type, area, values, comments);

        rows.push(row);
      }

       tables.push(new Table(id, area, name, rows));
    }
    return of(tables);
  }


}