import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { StateService } from './state.service';
import { Row } from 'src/app/models/row';
import { Table } from 'src/app/models/table';

const URL = 'http://127.0.0.1:5000'

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
    const path = `${URL}/get_source_schema?path=D:/mdcr.xlsx`;
    this.httpClient.get<any>(path)
      .subscribe(data => this._normalize(data, 'source')
        .subscribe(tables => this.stateService.initialize(tables, 'source')));
  }

  _initTargetData() {
    const path = `${URL}/get_cdm_schema?cdm_version=5.0.1`;
    this.httpClient.get<any>(path)
      .subscribe(data => this._normalize(data, 'target')
        .subscribe(tables => this.stateService.initialize(tables, 'target')));
  }

  getTopValues (row) {
    const { tableName, name } = row;
    const path = `${URL}/get_top_values?table_name=${tableName}&column_name=${name}`;

    return this.httpClient.get<any>(path)
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
        const tableName = item.table_name;
        const name = item.column_list[j].column_name;
        const type = item.column_list[j].column_type;
        const comments = [];
        const row = new Row(id, tableId, tableName, name, type, area, comments);

        rows.push(row);
      }

       tables.push(new Table(id, area, name, rows));
    }
    return of(tables);
  }


}