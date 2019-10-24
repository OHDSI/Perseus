import { Injectable } from '@angular/core';
import { ITable, ITableOptions, Table } from '../models/table';
import { RowOptions, Row } from '../models/row';
import { Area } from '../models/area';

export interface IState {
  source: StateItem;
  target: StateItem;
}

export interface StateItem {
  tables: ITable[];
}

@Injectable()
export class StateService {
  get Target(): any {
    return this.target;
  }

  set Target(target: any) {
    this.target = target;
  }

  private target = {};

  get initialized(): boolean {
    return (
      this._state.source.tables.length > 0 &&
      this._state.target.tables.length > 0
    );
  }

  get state(): IState {
    if (this._state) {
      return this._state;
    }
  }

  private _state: IState = {
    source: {
      tables: []
    },
    target: {
      tables: []
    }
  };

  constructor() {

  }

  initialize(tables: any[], area: string) {
    this._state[area].tables = tables;

    if (area === 'target' && this._state[area].tables.length > 0) {
      const res = [this.initSpecialtable()];
      this._state[area].tables = res.concat.apply(res, this._state[area].tables);
    }
  }

  initSpecialtable() {
    const conceptRowOptions: RowOptions = {
      id: 1,
      tableId: -100,
      tableName: 'SPECIAL',
      name: 'CONCEPT',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions: RowOptions = {
      id: 2,
      tableId: -100,
      tableName: 'SPECIAL',
      name: 'COMMON',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const tableOptions: ITableOptions = {
      id: -100,
      area: Area.Target,
      name: 'SPECIAL',
      rows: [new Row(conceptRowOptions), new Row(commonRowOptions)],
      visible: true,
      expanded: true
    };

    return new Table(tableOptions);
  }

  findTable(name: string): ITable {
    const index1 = this.state.target.tables.findIndex(t => t.name === name);
    const index2 = this.state.source.tables.findIndex(t => t.name === name);
    if (index1 > -1) {
      return this.state.target.tables[index1];
    } else if (index2 > -1) {
      return this.state.source.tables[index2];
    }

    return null;
  }
}
