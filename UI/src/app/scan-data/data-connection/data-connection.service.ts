import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbTypes } from '../scan-data.constants';
import { DataConnection } from './data-connection';
import { DatabricksConnection } from './databricks/databricks-connection';

interface DataConnectionIndex {
  [key: string]: DataConnection
}

@Injectable()
export class DataConnectionService {

  dataConnectionIndex: DataConnectionIndex= {
    [DbTypes.DATABRICKS]: new DatabricksConnection(
      this.http
    ),
  };

  constructor(private http: HttpClient) {}

  getDataConnection(dbType: string): DataConnection {
    return this.dataConnectionIndex[dbType]
  }
}