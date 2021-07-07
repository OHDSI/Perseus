import { Injectable } from '@angular/core';
import { DbSettings } from '../../models/scan-data/db-settings';

const initialState: DbSettings = {
  dbType: null,
  server: null,
  port: null,
  database: null,
  schema: null,
  user: null,
  password: null
};

@Injectable()
export class DqdConnectionSettingsStateService {

  private dqdState: DbSettings;

  constructor() {
    this.dqdState = Object.assign({}, initialState);
  }

  get state() {
    return this.dqdState;
  }

  set state(value: DbSettings) {
    this.dqdState = value;
  }
}
