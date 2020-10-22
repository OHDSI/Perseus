import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Row, RowOptions } from 'src/app/models/row';
import { ITableOptions, Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Mapping } from '../models/mapping';
import { HttpService } from './http.service';
import { StoreService } from './store.service';
import { BridgeService } from './bridge.service';

const URL = environment.url;

@Injectable()
export class DataService {
  batch = [];

  constructor(
    private httpService: HttpService,
    private storeService: StoreService,
    private bridgeService: BridgeService
  ) {
  }

  _normalize(data, area) {
    const tables = [];
    const uniqueIdentifierFields = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const name = item.table_name;
      const rows = [];

      for (let j = 0; j < item.column_list.length; j++) {
        let unique;
        if (area === 'target') {
          const upperCaseColumnName = item.column_list[j].column_name.toUpperCase();
          unique = upperCaseColumnName.indexOf('_ID') !== -1 && upperCaseColumnName.replace('_ID', '') === item.table_name.toUpperCase();
          if (unique) {
            uniqueIdentifierFields.push(upperCaseColumnName);
          }
        }
        const rowOptions: RowOptions = {
          id: j,
          tableId: i,
          tableName: item.table_name,
          name: item.column_list[j].column_name,
          type: item.column_list[j].column_type,
          isNullable: item.column_list[j].is_column_nullable ?
          item.column_list[j].is_column_nullable.toUpperCase() === 'YES' ? true : false : true,
          comments: [],
          uniqueIdentifier: unique,
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

    if (area === 'target') {
      const IsUniqueIdentifierRow = (row) => uniqueIdentifierFields.includes(row.name.toUpperCase());
      this.bridgeService.updateRowsProperties(tables, IsUniqueIdentifierRow, (row: any) => { row.uniqueIdentifier = true; });
    }

    return tables;
  }

  getZippedXml(mapping: Mapping): Observable<any> {
    return this.getXmlPreview(mapping).pipe(
      switchMap(jsonMapping => {
        const headers = new Headers();
        headers.set('Content-type', 'application/json; charset=UTF-8');
        headers.set('Cache-Control',  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');

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
        const tables = this.prepareTables(data, 'target');
        this.storeService.add('version', version);
        this.prepareTargetConfig(data);
        return tables;
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

  getLookupsList(lookupType): Observable<any> {
    return this.httpService.getLookupsList(lookupType);
  }

  getLookup(name, lookupType): Observable<any> {
    return this.httpService.getLookup(name, lookupType);
  }

  saveLookup(lookup, lookupType): Observable<any> {
    const { name, value } = lookup;
    return this.httpService.saveLookup({ name, value, lookupType });
  }

  deleteLookup(name, lookupType): Observable<any> {
    return this.httpService.deleteLookup(name, lookupType);
  }

  prepareTargetConfig(data) {
    const COLUMNS_TO_EXCLUDE_FROM_TARGET = ['CONCEPT', 'COMMON'];
    const targetConfig = {};

    data.map(table => {
      const tableName = table.table_name;
      if (COLUMNS_TO_EXCLUDE_FROM_TARGET.findIndex(name => name === tableName) < 0) {
        targetConfig[tableName] = {
          name: `target-${tableName}`,
          first: tableName,
          data: [tableName]
        };
      }
    });

    this.storeService.add('targetConfig', targetConfig);
  }

  prepareTables(data, key: string) {
    const tables = this._normalize(data, key);
    this.storeService.add(key, tables);
    return tables;
  }

  saveReportName(data, key){
    this.storeService.add(key, data);
  }
}
