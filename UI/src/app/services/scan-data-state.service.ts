import { Injectable } from '@angular/core';
import { DbSettings } from '../scan-data/model/db-settings';
import { TableToScan } from '../scan-data/model/table-to-scan';
import { ConnectionResult } from '../scan-data/model/connection-result';
import { ScanParams } from '../scan-data/model/scan-params';
import { DelimitedTextFileSettings } from '../scan-data/model/delimited-text-file-settings';
import { FileToScan } from '../scan-data/model/file-to-scan';
import { DbTypes } from '../scan-data/scan-data.constants';

export interface IScanDataStateService {
  state: any;
}

export interface ScanDataState {
  dataType: string;
  dbSettings: DbSettings;
  fileSettings: DelimitedTextFileSettings;
  scanParams: ScanParams;
  tablesToScan: TableToScan[];
  filteredTablesToScan: TableToScan[];
  filesToScan: FileToScan[];
  connectionResult: ConnectionResult;
}

const initialState: ScanDataState = {
  dataType: DbTypes.SQL_SERVER,
  dbSettings: {
    server: '822JNJ16S03V',
    user: 'cdm_builder',
    password: 'builder1!',
    database: 'mdcd_native_test',
    schema: 'dbo',
    port: 1433
  },
  fileSettings: {
    fileType: null,
    delimiter: ','
  },
  scanParams: {
    sampleSize: 100e3,
    scanValues: true,
    minCellCount: 5,
    maxValues: 1e3,
    calculateNumericStats: false,
    numericStatsSamplerSize: 100e3
  },
  tablesToScan: [],
  filteredTablesToScan: [],
  filesToScan: [],
  connectionResult: null
};

@Injectable({
  providedIn: 'root'
})
export class ScanDataStateService implements IScanDataStateService {

  private scanDataState: ScanDataState;

  get state() {
    return this.scanDataState;
  }

  set state(state: ScanDataState) {
    this.scanDataState = state;
  }

  constructor() {
    this.scanDataState = Object.assign({}, initialState) as ScanDataState;
  }
}
