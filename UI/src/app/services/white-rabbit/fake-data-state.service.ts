import { Injectable } from '@angular/core';
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings';
import { IScanDataStateService } from '@models/scan-data/state';
import { StateService } from '@services/state/state.service';

const initialState: FakeDataSettings = {
  maxRowCount: 10e3,
  doUniformSampling: false,
  userSchema: null
};

@Injectable()
export class FakeDataStateService implements IScanDataStateService, StateService {

  private fakeDataState: FakeDataSettings;

  get state() {
    return this.fakeDataState;
  }

  set state(state: FakeDataSettings) {
    this.fakeDataState = state;
  }

  constructor() {
    this.fakeDataState = {...initialState}
  }

  reset() {
    this.fakeDataState = {...initialState}
  }
}
