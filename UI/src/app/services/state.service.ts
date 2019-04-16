import { Injectable } from '@angular/core';

export interface IState {
    source: any;
    target: any;
}

@Injectable()
export class StateService {
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