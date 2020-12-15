import { Injectable } from '@angular/core';
import { DbSettings } from '../scan-data/model/db-settings';
import { IScanDataStateService } from './scan-data-state.service';

export interface CdmState {
  sourceDataType: string;
  destinationDataType: string;
  sourceDbSettings: DbSettings;
  destinationDbSettings: DbSettings;
}

const initialState = {
  sourceDbSettings: {
    dbType: null,
    server: null,
    user: null,
    password: null,
    database: null,
    schemaName: null
  },
  destinationDbSettings: {
    dbType: null,
    server: null,
    user: null,
    password: null,
    database: null,
    schemaName: null
  }
};

@Injectable({
  providedIn: 'root'
})
export class CdmStateService implements IScanDataStateService {

  private cdmState: CdmState;

  get state() {
    return this.cdmState;
  }

  set state(state: CdmState) {
    this.cdmState = state;
  }

  constructor() {
    this.cdmState = Object.assign({}, initialState) as CdmState;
  }
}
