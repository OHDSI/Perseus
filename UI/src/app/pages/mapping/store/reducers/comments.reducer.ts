import { Action } from '@ngrx/store';
import { ActionTypes, CommentsAction } from 'src/app/pages/mapping/store/actions/comments.actions';
import { IComment } from '../../components/dialog/dialog.component';

export interface Area {
  [panelTitle: string]: Panel;
}

export interface Panel {
  [rowName: string]: Row;
}

export interface Row {
  comments: IComment[];
}

export interface State {
    'source': Area;
    'target': Area;
}

export const initialState: State = {
  'source': {},
  'target': {}
}

export function commentsReducer(state = initialState, action: CommentsAction) {
    switch (action.type) {
        case ActionTypes.Update: {
            return {
                ...state
             };
        }

        default: {
            return state;
          }
    }
}