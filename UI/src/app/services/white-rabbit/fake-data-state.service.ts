import { Injectable } from '@angular/core';
import { FakeDataParams } from '@models/scan-data/fake-data-params';
import { IScanDataStateService } from '@models/scan-data/state';
import { StateService } from '@services/state/state.service';

const initialState: FakeDataParams = {
  maxRowCount: 10e3,
  doUniformSampling: false,
  dbSettings: null
};

@Injectable()
export class FakeDataStateService implements IScanDataStateService, StateService {

  private fakeDataState: FakeDataParams;

  get state() {
    return this.fakeDataState;
  }

  set state(state: FakeDataParams) {
    this.fakeDataState = state;
  }

  constructor() {
    this.fakeDataState = {...initialState}
  }

  reset() {
    this.fakeDataState = {...initialState}
  }
}
