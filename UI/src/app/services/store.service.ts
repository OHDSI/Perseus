import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITable, Table } from '@models/table';
import { cloneDeep, uniq } from '../infrastructure/utility';
import { filter, map, pairwise, startWith } from 'rxjs/operators';
import { State } from '@models/state';
import { StateService } from '@services/state/state.service';
import { Area } from '@models/area'
import { EtlMapping } from '@models/perseus/etl-mapping'

export const initialState: State = {
  target: [],
  targetConfig: {},
  source: [],
  linkTablesSearch: {},
  linkFieldsSearch: {},
  cdmVersions: [],
  targetClones: {},
  recalculateSimilar: true,
  concepts: {}
}

type StoreTablesKey = { [K in keyof State]: State[K] extends ITable[] ? K : never }[keyof State]

@Injectable()
export class StoreService implements StateService {

  private readonly storeState = new BehaviorSubject<State>({...initialState});

  readonly state$ = this.storeState.asObservable();

  get state(): State {
    return this.storeState.getValue();
  }

  set state(val) {
    this.storeState.next(val);
  }

  get copyState() {
    return {...this.storeState.getValue()}
  }

  get etlMapping(): EtlMapping {
    return this.state.etlMapping;
  }

  get etlMappingId(): number {
    return this.etlMapping?.id
  }

  get cdmVersion(): string {
    return this.etlMapping?.cdm_version
  }

  get scanReportName(): string {
    return this.etlMapping?.scan_report_name
  }

  add<K extends keyof State>(key: K | Area, value: State[K]) {
    this.state = { ...this.state, [ key ]: value };
  }

  removeTable<T>(storeKey: StoreTablesKey, table: ITable) {
    const tables = this.state[storeKey];
    if (tables && tables.length) {
      const updatedTables = tables.filter(it => it !== table);
      this.state = { ...this.state, [ storeKey ]: updatedTables };
    }
  }

  updateTable(storeKey: StoreTablesKey, table: ITable, updates: ITable) {
    const tables = this.state[ storeKey ];
    if (tables && tables.length && table) {
      const updatedTables = tables.map(it => it.name === table.name ? new Table({ ...it, ...updates }) : new Table(it));
      this.state = { ...this.state, [ storeKey ]: updatedTables };
    }
  }

  getMappedTables(): {source: ITable[], target: ITable[]} {
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

  reset() {
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
  on<K extends keyof State>(key: K, equal: (a: State[K], b: State[K]) => boolean = (a, b) => a === b): Observable<State[K]> {
    return this.storeState.asObservable()
      .pipe(
        map(state => state[key]),
        startWith<State[K], State[K]>(null),
        pairwise(),
        filter(([prev, curr]) => !equal(prev, curr)),
        map(([, curr]) => curr)
      )
  }

  addEtlMapping(etlMapping: EtlMapping): void {
    const prevCdmVersion = this.cdmVersion
    this.add('etlMapping', {
      ...etlMapping,
      cdm_version: prevCdmVersion
    })
  }

  addCdmVersion(version: string) {
    this.add('etlMapping', {
      ...this.etlMapping,
      cdm_version: version
    })
  }

  mappingConfig(): string[][] {
    const mappingConfig = [];
    const state = this.state
    Object.keys(state.targetConfig).forEach(targetTableName => {
      const items = state.targetConfig[targetTableName].data;
      if (items.length > 1) {
        mappingConfig.push(cloneDeep(items));
      }
    });
    return mappingConfig;
  }
}

export function etlMappingToProjectInfo(etlMapping?: EtlMapping): { cdmVersion: string, reportName: string } {
  return {
    cdmVersion: etlMapping?.cdm_version ? `CDM v${etlMapping.cdm_version}` : 'CDM version',
    reportName: etlMapping?.source_schema_name ? etlMapping.source_schema_name : 'Report name'
  };
}
