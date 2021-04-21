import { Injectable } from '@angular/core';
import { FakeDataParams } from '../../scan-data/model/fake-data-params';
import { IScanDataStateService } from './scan-data-state.service';

const initialState = {
  maxRowCount: 10e3,
  doUniformSampling: false
};

@Injectable()
export class FakeDataStateService implements IScanDataStateService {

  private fakeDataState: FakeDataParams;

  get state() {
    return this.fakeDataState;
  }

  set state(state: FakeDataParams) {
    this.fakeDataState = state;
  }

  constructor() {
    this.fakeDataState = Object.assign({}, initialState) as FakeDataParams;
  }
}
