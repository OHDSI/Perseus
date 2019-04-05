import { Action } from '@ngrx/store';

export enum SourceActionTypes {
    INITIALIZE = '[Source] INITIALIZE',
    
}

export class Initialize implements Action {
    readonly type = SourceActionTypes.INITIALIZE;

    constructor(public payload: any) {}
}

export type SourceAction = Initialize;

