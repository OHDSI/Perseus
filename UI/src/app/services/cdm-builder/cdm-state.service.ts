import { Injectable } from '@angular/core';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { IScanDataStateService } from '@models/scan-data/state';
import { StateService } from '@services/state/state.service';

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
export class CdmStateService implements IScanDataStateService, StateService {

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

  get sourceDataType() {
    return this.cdmState.sourceDbSettings.dbType
  }

  set sourceDataType(value: string) {
    this.cdmState.sourceDbSettings.dbType = value
  }

  constructor() {
    this.cdmState = {...initialState};
  }

  reset() {
    this.cdmState = {...initialState};
  }
}
