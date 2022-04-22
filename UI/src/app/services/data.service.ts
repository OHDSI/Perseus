import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Row, RowOptions } from 'src/app/models/row';
import { ITableOptions, Table } from 'src/app/models/table';
import { EtlMappingForZipXmlGeneration } from '@models/etl-mapping-for-zip-xml-generation';
import { PerseusApiService } from './perseus/perseus-api.service';
import { StoreService } from './store.service';
import { BridgeService } from './bridge.service';
import { removeExtension } from '@utils/file';
import { ColumnInfo } from '@models/perseus/column-info';
import { COLUMNS_TO_EXCLUDE_FROM_TARGET } from '@app/app.constants';
import { Area } from '@models/area'
import { TableInfoResponse } from '@models/perseus/table-info-response'
import { PerseusXmlService } from '@services/perseus/perseus-xml.service'
import { MatDialog } from '@angular/material/dialog'
import { fromBlobError, openErrorDialog, parseHttpError } from '@utils/error'

@Injectable()
export class DataService {
  constructor(private perseusService: PerseusApiService,
              private storeService: StoreService,
              private bridgeService: BridgeService,
              private perseusXmlService: PerseusXmlService,
              private dialogService: MatDialog) {}

  _normalize(data: TableInfoResponse[], area: Area) {
    const tables = [];
    const uniqueIdentifierFields = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const name = item.table_name.toLowerCase();
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
          tableName: item.table_name.toLowerCase(),
          name: item.column_list[j].column_name,
          type: item.column_list[j].column_type,
          isNullable: item.column_list[j].is_column_nullable ?
            item.column_list[j].is_column_nullable.toUpperCase() === 'YES' : true,
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

  getZippedXml(mapping: EtlMappingForZipXmlGeneration): Observable<File> {
    const reportName = removeExtension(this.storeService.scanReportName) ?? 'etl-mapping'
    return this.perseusXmlService.generateZipXml(reportName, mapping)
      .pipe(
        fromBlobError(),
        catchError(error => {
          openErrorDialog(this.dialogService, 'Failed to generate zip XML', parseHttpError(error))
          throw error
        })
      )
  }

  getTargetData(version: string) {
    return this.perseusService.getTargetData(version).pipe(
      map(data => {
        const filteredData = data.filter(it => !COLUMNS_TO_EXCLUDE_FROM_TARGET.includes(it.table_name.toUpperCase()));
        const tables = this.prepareTables(filteredData, Area.Target);
        this.storeService.addCdmVersion(version)
        this.prepareTargetConfig(filteredData);
        return tables;
      })
    );
  }

  getColumnInfo(etlMappingId: number, tableName: string, columnName: string): Observable<ColumnInfo> {
    return this.perseusService.getColumnInfo(etlMappingId, tableName, columnName)
      .pipe(
        map(info => {
          if (info.top_10[info.top_10.length - 1] === 'List truncated...') {
            info.top_10.pop();
          }

          return {
            name: info.Field,
            type: info.Type,
            uniqueValues: info['N unique values'],
            topValues: info.percentage
              .map((percentage, index) => ({
                value: info.top_10[index],
                frequency: info.frequency[index],
                percentage
              }))
          };
        })
      );
  }

  prepareTargetConfig(data) {
    const targetConfig = {};
    data.map(table => {
      const tableName = table.table_name.toLowerCase();
      targetConfig[ tableName ] = {
        name: `target-${tableName}`,
        first: tableName,
        data: [ tableName ]
      };
    });

    this.storeService.add('targetConfig', targetConfig);
  }

  prepareTables(data: TableInfoResponse[], key: Area) {
    const tables = this._normalize(data, key);
    this.storeService.add(key, tables);
    return tables;
  }
}
