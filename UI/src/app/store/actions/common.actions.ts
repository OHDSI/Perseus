import { Action } from '@ngrx/store';

export enum ActionTypes {
  Collapsed = '[Common] Collapsed',
  Expanded = '[Common] Expanded',
  Linked = '[Common] Linked',
}

export class Collapsed implements Action {
  readonly type = ActionTypes.Collapsed;
}

export class Expanded implements Action {
  readonly type = ActionTypes.Expanded;

  constructor(public payload: any) {}
}

export class Linked implements Action {
  readonly type = ActionTypes.Linked;
}

export type CommonAction = Collapsed | Expanded | Linked;