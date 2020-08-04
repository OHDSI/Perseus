import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    this.state = { ...this.state, [key]: value };
  }

  resetAllData() {
    this.initialState = {
      version: undefined,
      filtered: undefined,
      target: [],
      source: [],
      targetConfig: {},
      report: undefined
    };
    this.storeState.next(this.initialState);
  }
}
