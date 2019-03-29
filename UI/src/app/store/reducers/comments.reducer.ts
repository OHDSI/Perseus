import { ActionTypes, CommentsAction } from 'src/app/store/actions/comments.actions';
import { Area } from 'src/app/models/area';

export interface State {
    source: Area;
    target: Area;
}

export const initialState: State = {
  source: {},
  target: {}
}

export function commentsReducer(state = initialState, action: CommentsAction) {
    switch (action.type) {
        default: {
            return state;
          }
    }
}