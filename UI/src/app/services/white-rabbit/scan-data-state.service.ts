import { Injectable } from '@angular/core';
import { IScanDataStateService } from '@models/scan-data/state';
import { initialState, ScanDataState } from '@models/scan-data/scan-data-state';
import { StateService } from '@services/state/state.service';

@Injectable()
export class ScanDataStateService implements IScanDataStateService, StateService {

  private scanDataState: ScanDataState;

  get state() {
    return this.scanDataState;
  }

  set state(state: ScanDataState) {
    this.scanDataState = state;
  }

  constructor() {
    this.scanDataState = {...initialState}
  }

  reset() {
    this.scanDataState = {...initialState}
  }
}
