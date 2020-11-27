import { Injectable } from '@angular/core';
import { DbSettings } from '../scan-data/model/db-settings';
import { TableToScan } from '../scan-data/model/table-to-scan';
import { ConnectionResult } from '../scan-data/model/connection-result';
import { ScanParams } from '../scan-data/model/scan-params';

export interface ScanDataState {
  dbSettings: DbSettings;
  scanParams: ScanParams;
  tablesToScan: TableToScan[];
  filteredTablesToScan: TableToScan[];
  connectionResult: ConnectionResult;
}

const initialState: ScanDataState = {
  // dbSettings: {
  //   dbType: null,
  //   server: null,
  //   user: null,
  //   password: null,
  //   database: null,
  // },
  dbSettings: {
    dbType: 'SQL Server',
    server: '822JNJ16S03V',
    user: 'cdm_builder',
    password: 'builder1!',
    database: 'CPRD',
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
  connectionResult: null
};

@Injectable({
  providedIn: 'root'
})
export class ScanDataStateService {

  private dbSettings: DbSettings;

  private scanParams: ScanParams;

  private tablesToScan: TableToScan[];

  private filteredTablesToScan: TableToScan[];

  private connectionResult: ConnectionResult;

  get state() {
    return {
      dbSettings: this.dbSettings,
      scanParams: this.scanParams,
      tablesToScan: this.tablesToScan,
      filteredTablesToScan: this.filteredTablesToScan,
      connectionResult: this.connectionResult
    };
  }

  set state(state: ScanDataState) {
    this.dbSettings = state.dbSettings;
    this.scanParams = state.scanParams;
    this.tablesToScan = state.tablesToScan;
    this.filteredTablesToScan = state.filteredTablesToScan;
    this.connectionResult = state.connectionResult;
  }

  constructor() {
    const state: ScanDataState = Object.assign({}, initialState);

    this.dbSettings = state.dbSettings;
    this.scanParams = state.scanParams;
    this.tablesToScan = state.tablesToScan;
    this.filteredTablesToScan = state.filteredTablesToScan;
    this.connectionResult = state.connectionResult;
  }
}
