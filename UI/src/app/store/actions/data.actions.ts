import { Action } from '@ngrx/store';
import { Data } from 'src/app/models/data';

export enum DataActionTypes {
  FETCH_DATA = '[Data] Fetch Data',
  FETCH_DATA_SUCCESS = '[Data] Fetch Data Success',
  FETCH_DATA_FAIL = '[Data] Fetch Data Fail',
  INITIALIZE = '[Data] Initialize',
  ADD_COMMENT = '[Data] Add Comment',
}

export class FetchData implements Action {
  readonly type = DataActionTypes.FETCH_DATA;
}

export class Initialize implements Action {
  readonly type = DataActionTypes.INITIALIZE;

  constructor(public payload: any) {}
}

export class AddComment implements Action {
  readonly type = DataActionTypes.ADD_COMMENT;

  constructor(public payload: any) {}
}

////////////////////////////////////////////////////

export class FetchDataSuccess implements Action {
    readonly type = DataActionTypes.FETCH_DATA_SUCCESS;

    constructor(public payload: Data) {}
}

export class FetchDataFail implements Action {
    readonly type = DataActionTypes.FETCH_DATA_FAIL;

    constructor(public payload: string) {}
}

export type DataAction = FetchData | FetchDataSuccess | FetchDataFail | Initialize | AddComment;
