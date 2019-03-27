import { Action } from '@ngrx/store';
import { IComment } from '../../components/dialog/dialog.component';

export enum ActionTypes {
  Update = '[Comment] Update'
}

export class Update implements Action {
  readonly type = ActionTypes.Update;
}

export type CommentsAction = Update;