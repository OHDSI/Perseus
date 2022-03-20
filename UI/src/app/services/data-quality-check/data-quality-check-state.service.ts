import { Injectable } from '@angular/core';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { StateService } from '@services/state/state.service';
import { DbTypes } from '@scan-data/scan-data.constants'

const initialState: DbSettings = {
  dbType: DbTypes.SQL_SERVER,
  server: '10.110.1.32',
  port: 1433,
  database: 'cdm_test_53',
  schema: 'dbo',
  user: 'sa',
  password: 'vasjDHnv45#'
};

@Injectable()
export class DataQualityCheckStateService implements StateService {

  private dqdState: DbSettings;

  constructor() {
    this.dqdState = {...initialState}
  }

  get state() {
    return this.dqdState;
  }

  set state(value: DbSettings) {
    this.dqdState = value;
  }

  reset() {
    this.state = {...initialState}
  }
}
