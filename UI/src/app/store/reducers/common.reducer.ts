import { Action } from '@ngrx/store';
import { ActionTypes } from 'src/app/store/actions/common.actions';

export interface State {
    hint: string;
}

export const initialState: State = {
    hint: 'Expand tables to make links'
}

export function commonReducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.Collapsed: {
            return {
                ...state,
                hint: 'Expand tables to make links'
             };
        }
        case ActionTypes.Expanded: {
            return {
                ...state,
                hint: 'Drag and drop source item to target item'
             };
        }
        case ActionTypes.Linked: {
            return {
                ...state,
                hint: ''
             };
        }

        default: {
            return state;
          }
    }
}