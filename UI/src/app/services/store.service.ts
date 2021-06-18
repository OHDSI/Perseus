import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Table } from '@models/table';
import { uniq } from '../infrastructure/utility';
import { removeExtension } from '@utils/file';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, pairwise, startWith } from 'rxjs/operators';
import { State } from '@models/state';
import { StateService } from '@services/state/state.service';

const initialState: State = {
  target: [],
  targetConfig: {},
  source: [],
  mappedSource: [],
  linkTablesSearch: {},
  linkFieldsSearch: {},
  cdmVersions: [],
  targetClones: {},
  mappingEmpty: true,
  recalculateSimilar: true,
  concepts: {},
  isMappingPage: false
}

@Injectable()
export class StoreService implements StateService {
  private readonly storeState = new BehaviorSubject<State>({...initialState});
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
    this.storeState.next({
      ...initialState,
      cdmVersions
    });
  }

  /**
   * @param key - listenable for a change in the store
   * @param equal - function used for compare new value with previous
   */
  on<T>(key: string, equal: (a: T, b: T) => boolean = (a, b) => a === b): Observable<T> {
    const prevState = this.state[key] as T
    return this.storeState.asObservable()
      .pipe(
        map(state => state[key] as T),
        startWith<T, T>(prevState),
        pairwise(),
        filter(([prev, curr]) => prev !== curr),
        map(([, curr]) => curr)
      )
  }

  reset() {
    this.storeState.next({...initialState});
  }
}

export function stateToInfo(state: any): { cdmVersion: string, reportName: string } {
  return {
    cdmVersion: state.version ? `CDM v${state.version}` : 'CDM version',
    reportName: state.report ? removeExtension(state.report) : 'Report name'
  };
}
