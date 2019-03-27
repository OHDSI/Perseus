import { Action } from '@ngrx/store';
import { ActionTypes, CommonAction } from 'src/app/pages/mapping/store/actions/common.actions';

export interface State {
    convasHeight: number;
}

export const initialState: State = {
    convasHeight: 0
}

export function commonReducer(state = initialState, action: CommonAction) {
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
                convasHeight: action.payload
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