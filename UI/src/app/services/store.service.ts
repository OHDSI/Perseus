import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Table } from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private initialState = {
    version: undefined,
    filtered: undefined,
    target: [],
    targetConfig: {},
    source: [],
    report: undefined,
    search: {
      source: undefined,
      target: undefined,
      sourceColumns: undefined
    },
    cdmVersions: []
  };
  private readonly storeState = new BehaviorSubject<any>(this.initialState);
  readonly state$ = this.storeState.asObservable();

  get state() {
    return this.storeState.getValue();
  }

  set state(val) {
    this.storeState.next(val);
  }

  add(key, value) {
    this.state = { ...this.state, [key]: value };
  }

  removeTable(storeKey, table) {
    const tables = this.state[storeKey];
    if (tables && tables.length) {
      const updatedTables = tables.filter(it => it !== table);
      this.state = { ...this.state, [storeKey]: updatedTables };
    }
  }

  updateTable(storeKey, table, updates) {
    const tables = this.state[storeKey];
    if (tables && tables.length && table) {
      const updatedTables = tables.map(it => it.name === table.name ? new Table({ ...it, ...updates }) : new Table(it));
      this.state = { ...this.state, [storeKey]: updatedTables };
    }
  }

  resetAllData() {
    this.initialState = {
      version: undefined,
      filtered: undefined,
      target: [],
      source: [],
      targetConfig: {},
      report: undefined,
      search: {
        source: undefined,
        target: undefined,
        sourceColumns: undefined
      },
      cdmVersions: this.state.cdmVersions
    };
    this.storeState.next(this.initialState);
  }
}
