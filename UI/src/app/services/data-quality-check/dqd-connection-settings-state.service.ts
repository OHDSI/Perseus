import { Injectable } from '@angular/core';
import { DbSettings } from '../../scan-data/model/db-settings';

const initialState: DbSettings = {
  dbType: null,
  server: null,
  port: null,
  database: null,
  schema: null,
  user: null,
  password: null
};

@Injectable({
  providedIn: 'root'
})
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
