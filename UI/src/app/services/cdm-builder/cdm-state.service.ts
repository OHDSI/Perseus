import { Injectable } from '@angular/core';
import { DbSettings } from '../../models/scan-data/db-settings';
import { IScanDataStateService } from '../white-rabbit/scan-data-state.service';

export interface CdmState {
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
    schema: null
  },
  destinationDbSettings: {
    dbType: null,
    server: null,
    user: null,
    password: null,
    database: null,
    schema: null
  }
};

@Injectable()
export class CdmStateService implements IScanDataStateService {

  private isInit = false;
  private cdmState: CdmState;

  get state() {
    return this.cdmState;
  }

  set state(state: CdmState) {
    this.isInit = true;
    this.cdmState = state;
  }

  get isSet() {
    return this.isInit;
  }

  constructor() {
    this.cdmState = Object.assign({}, initialState) as CdmState;
  }
}
