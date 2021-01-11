import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Table } from '../models/table';

import { uniq } from '../infrastructure/utility';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private initialState = {
    version: undefined,
    filteredTables: undefined,
    filteredFields: undefined,
    target: [],
    targetConfig: {},
    source: [],
    mappedSource: [],
    report: undefined,
    linkTablesSearch: {
      source: undefined,
      target: undefined,
      sourceColumns: undefined
    },
    linkFieldsSearch: {},
    cdmVersions: [],
    targetClones: {},
    reportFile: undefined,
    mappingEmpty: true,
    sourceSimilar: undefined,
    targetSimilar: undefined,
    recalculateSimilar: true
  };
  private readonly storeState = new BehaviorSubject<any>(Object.assign({}, this.initialState));
  readonly state$ = this.storeState.asObservable();

  get state() {
    return this.storeState.getValue();
  }

  set state(val) {
    this.storeState.next(val);
  }

  add(key, value) {
    this.state = { ...this.state, [ key ]: value };
  }

  removeTable(storeKey, table) {
    const tables = this.state[ storeKey ];
    if (tables && tables.length) {
      const updatedTables = tables.filter(it => it !== table);
      this.state = { ...this.state, [ storeKey ]: updatedTables };
    }
  }

  updateTable(storeKey, table, updates) {
    const tables = this.state[ storeKey ];
    if (tables && tables.length && table) {
      const updatedTables = tables.map(it => it.name === table.name ? new Table({ ...it, ...updates }) : new Table(it));
      this.state = { ...this.state, [ storeKey ]: updatedTables };
    }
  }

  getMappedTables() {
    let sourceNames = [];
    const targetNames = Object.keys(this.state.targetConfig).filter(key => {
      const data = this.state.targetConfig[ key ].data;
      if (data.length > 1) {
        sourceNames.push(...data.slice(1, data.length));
        return true;
      }
      return false;
    });
    sourceNames = uniq(sourceNames);

    return {
      source: this.state.source.filter(table => sourceNames.includes(table.name)),
      target: this.state.target.filter(table => targetNames.includes(table.name))
    };
  }

  resetAllData() {
    const cdmVersions = this.state.cdmVersions;
    this.storeState.next(Object.assign({}, this.initialState));
    this.add('cdmVersions', cdmVersions);
    this.state.targetClones = {};

  }
}

export function stateToInfo(state: any): { cdmVersion: string, reportName: string } {
  return {
    cdmVersion: state.version ? `CDM v${state.version}` : 'CDM version',
    reportName: state.report || 'Report name'
  };
}
