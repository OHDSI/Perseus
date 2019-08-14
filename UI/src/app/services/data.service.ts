import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { StateService } from './state.service';
import { Row } from 'src/app/models/row';
import { Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Mapping } from '../models/mapping';

const URL = environment.url;

@Injectable()
export class DataService {
  batch = [];

  constructor(
    private httpClient: HttpClient,
    private stateService: StateService
  ) {}

  initialize(): Observable<any> {
    if (!this.stateService.initialized) {
      this.batch = [this._initSourceData(), this._initTargetData()];
      return forkJoin(this.batch);
    }

    return of(true);
  }

  _initSourceData(): Observable<any> {
    const path = `${URL}/get_source_schema?path=default`;
    return this.httpClient.get<any>(path).pipe(
      map(data => {
        const tables = this._normalize(data, 'source');
        this.stateService.initialize(tables, 'source');
      })
    );
  }

  _initTargetData(): Observable<any> {
    const path = `${URL}/get_cdm_schema?cdm_version=5.0.1`;
    return this.httpClient.get<any>(path).pipe(
      map(data => {
        const tables = this._normalize(data, 'target');
        this.stateService.initialize(tables, 'target');
      })
    );
  }

  getTopValues(row) {
    const { tableName, name } = row;
    const path = `${URL}/get_top_values?table_name=${tableName}&column_name=${name}`;

    return this.httpClient.get<any>(path);
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
    return tables;
  }

  getZippedXml(mapping: Mapping): Observable<any> {
    return this._getXml(mapping).pipe(
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

  // getXml(mapping: Mapping): Promise<any> {
  //   const headers = new Headers();
  //   headers.set('Content-type', 'application/json; charset=UTF-8');

  //   const init = {
  //     method: 'POST',
  //     headers: headers,
  //     body: JSON.stringify(mapping)
  //   };

  //   const url = `${URL}/get_xml`;
  //   const request = new Request(url, init);

  //   return new Promise((resolve, reject) => {
  //     fetch(request)
  //     .then(responce => responce.blob())
  //     .then(blob => {
  //       const file = new File([blob], 'mappings.json');
  //       resolve(file);
  //     });
  //   });
  // }

  private _getXml(mapping: Mapping) {
    const path = `${URL}/get_xml`;
    return this.httpClient.post(path, mapping);
  }
}
