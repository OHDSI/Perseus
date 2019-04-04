import { Action } from '@ngrx/store';

export enum ColumnsActionTypes {
  INITIALIZE_COLUMNS = '[Columns] Initialize Columns',
}

export class InitializeColumns implements Action {
    readonly type = ColumnsActionTypes.INITIALIZE_COLUMNS;

    constructor(public payload: {area: any, table: any, columns: any[]}) {}
}

export type ColumnsAction = InitializeColumns;
