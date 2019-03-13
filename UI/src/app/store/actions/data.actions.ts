import { Action } from '@ngrx/store';
import { SourceTable } from './../../models/sourceTable';

export enum DataActionTypes {
  LOAD_DATA = '[Data] Load Data',
  LOAD_DATA_SUCCESS = '[Data] Load Data Success',
  LOAD_DATA_FAIL = '[Data] Load Data Fail',
}

export class LoadData implements Action {
  readonly type = DataActionTypes.LOAD_DATA;
}

export class LoadDataSuccess implements Action {
    readonly type = DataActionTypes.LOAD_DATA_SUCCESS;

    constructor(public payload: { sourceTable: SourceTable }) {}
}

export class LoadDataFail implements Action {
    readonly type = DataActionTypes.LOAD_DATA_FAIL;

    constructor(public payload: string) {}
}

export type DataAction = LoadData | LoadDataSuccess | LoadDataFail;
