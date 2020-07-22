import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Row, RowOptions } from 'src/app/models/row';
import { ITableOptions, Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Mapping } from '../models/mapping';
import { HttpService } from './http.service';
import { StateService } from './state.service';
import { StoreService } from './store.service';

const URL = environment.url;

@Injectable()
export class DataService {
  batch = [];

  constructor(
    private httpClient: HttpClient,
    private httpService: HttpService,
    private stateService: StateService,
    private storeService: StoreService,
  ) {
  }

  _normalize(data, area) {
    const tables = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const name = item.table_name;
      const rows = [];

      for (let j = 0; j < item.column_list.length; j++) {
        const rowOptions: RowOptions = {
          id: j,
          tableId: i,
          tableName: item.table_name,
          name: item.column_list[j].column_name,
          type: item.column_list[j].column_type,
          comments: [],
          area
        };

        const row = new Row(rowOptions);

        rows.push(row);
      }

      const tableOptions: ITableOptions = {
        id,
        area,
        name,
        rows
      };

      tables.push(new Table(tableOptions));
    }
    return tables;
  }

  getZippedXml(mapping: Mapping): Observable<any> {
    return this.getXmlPreview(mapping).pipe(
      switchMap(jsonMapping => {
        const headers = new Headers();
        headers.set('Content-type', 'application/json; charset=UTF-8');

        const init = {
          method: 'GET',
          headers
        };

        const url = `${URL}/get_zip_xml`;
        const request = new Request(url, init);

        return from(
          new Promise((resolve, reject) => {
            fetch(request)
              .then(responce => responce.blob())
              .then(blob => {
                const file = new File([blob], 'mapping-xml.zip');
                resolve(file);
              });
          })
        );
      })
    );
  }

  getXmlPreview(mapping: Mapping): Observable<any> {
    return this.httpService.getXmlPreview(mapping);
  }

  getSqlPreview(sourceTable: string): Observable<any> {
    return this.httpService.getSqlPreview(sourceTable);
  }

  getCDMVersions() {
    return this.httpService.getCDMVersions();
  }

  getTargetData(version) {
    return this.httpService.getTargetData(version).pipe(
      map(data => {
        this.storeService.add('version', version);
        return this.prepareTables(data, 'target');
      })
    );
  }

  getSourceSchema(path) {
    return this.httpService.getSourceSchema(path).pipe(
      map(data => this.prepareTables(data, 'source'))
    );
  }

  getSourceSchemaData(name: string): Observable<any> {
    return this.httpService.getSourceSchemaData(name).pipe(
      map(data => this.prepareTables(data, 'source'))
    );
  }

  getTopValues(tableName: string, columnName: string): Observable<any> {
    return this.httpService.getTopValues(tableName, columnName);
  }

  prepareTables(data, key) {
    const tables = this._normalize(data, key);
    this.storeService.add(key, tables);
    return tables;
  }

  saveReportName(data, key){
    this.storeService.add(key, data);
  }
}
