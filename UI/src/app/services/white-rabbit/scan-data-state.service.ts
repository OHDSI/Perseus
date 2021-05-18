import { Injectable } from '@angular/core';
import { DbSettings } from '../../models/scan-data/db-settings';
import { TableToScan } from '../../models/scan-data/table-to-scan';
import { ConnectionResult } from '../../models/scan-data/connection-result';
import { ScanParams } from '../../models/scan-data/scan-params';
import { DelimitedTextFileSettings } from '../../models/scan-data/delimited-text-file-settings';

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
  filesToScan: File[];
  connectionResult: ConnectionResult;
}

const initialState: ScanDataState = {
  dataType: null,
  dbSettings: {
    server: null,
    user: null,
    password: null,
    database: null,
    schema: null,
    port: null
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

@Injectable()
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
