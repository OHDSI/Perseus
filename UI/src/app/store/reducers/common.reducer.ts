import { Action } from '@ngrx/store';

import { ActionTypes, CommonAction } from 'src/app/store/actions/common.actions';

export interface State {

}

export const initialState: State = {

}

export function commonReducer(state = initialState, action: CommonAction) {
    switch (action.type) {
        case ActionTypes.Collapsed: {
            return {
                ...state
             };
        }
        case ActionTypes.Expanded: {
            return {
                ...state
             };
        }
        case ActionTypes.Linked: {
            return {
                ...state
             };
        }

        default: {
            return state;
          }
    }
}