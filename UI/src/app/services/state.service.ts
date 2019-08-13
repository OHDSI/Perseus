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
  get initialized(): boolean {
    return this._state.source.tables.length > 0 && this._state.target.tables.length > 0;
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

  get state(): IState {
    if (this._state) {
      return this._state;
    }
  }
}
