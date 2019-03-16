import { DataActionTypes, DataAction } from 'src/app/store/actions/data.actions';
import { Table } from 'src/app/models/table';

export interface State {
    source: Table[];
    target: Table[];
    error: string;
}

export function dataReducer(state = {}, action: DataAction) {
    switch (action.type) {
        case DataActionTypes.FETCH_DATA: {
            return {
                ...state
             };
        }

        case DataActionTypes.FETCH_DATA_SUCCESS: {
            return {
                ...state,
                ...action.payload
             };
        }

        case DataActionTypes.FETCH_DATA: {
            return {
                ...state
             };
        }

        case DataActionTypes.FETCH_DATA_FAIL: {
            return {
                ...state,
                error: action.payload
             };
        }

        default: {
            return state;
          }
    }
}