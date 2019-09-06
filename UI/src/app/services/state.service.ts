import { Injectable } from '@angular/core';
import { ITable } from '../models/table';

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
    return this._state.source.tables.length > 0 && this._state.target.tables.length > 0;
  }

  get state(): IState {
    if (this._state) {
      return this._state;
    }
  }

  private _state: IState = {
    source: {
      tables: [],
    },
    target: {
      tables: []
    }
  };

  constructor() {}

  initialize(tables: any[], area: string) {
    this._state[area].tables = tables;
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
