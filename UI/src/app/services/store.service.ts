import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITable} from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private initialState = {
    version: undefined,
    filtered: undefined,
    target: [],
    source: [],
    report: undefined
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
    this.state = {...this.state, [key]: value};
  }

  findTable(name: string): ITable {
    const index1 = this.state.target.findIndex(t => t.name === name);
    const index2 = this.state.source.findIndex(t => t.name === name);
    if (index1 > -1) {
      return this.state.target[index1];
    } else if (index2 > -1) {
      return this.state.source[index2];
    }

    return null;
  }

  resetAllData() {
    this.initialState = {
      version: undefined,
      filtered: undefined,
      target: [],
      source: [],
      report: undefined
    };
    this.storeState.next(this.initialState);
  }
}
