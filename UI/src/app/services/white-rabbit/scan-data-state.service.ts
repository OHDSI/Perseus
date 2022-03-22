import { Injectable } from '@angular/core';
import { IScanDataStateService } from '@models/scan-data/state';
import { initialState, ScanDataState } from '@models/white-rabbit/scan-data-state';
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

  get dataType(): string {
    return this.state.dataType
  }

  set dataType(value: string) {
    this.state.dataType = value
  }

  constructor() {
    this.scanDataState = {...initialState}
  }

  reset() {
    this.scanDataState = {...initialState}
  }
}
