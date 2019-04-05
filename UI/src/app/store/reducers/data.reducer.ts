import { DataActionTypes, DataAction } from 'src/app/store/actions/data.actions';
import { createFeatureSelector, ActionReducerMap, createSelector } from '@ngrx/store';
import { SourceState, sourceReducer } from './source.reducer';
import { TargetState, targetReducer } from './target.reducer';

import * as fromSource from './source.reducer';
import * as fromTarget from './target.reducer';


export interface DataState {
    source: SourceState;
    target: TargetState;
}

export const initialState: DataState = {
    source: {},
    target: {}
};

export function dataReducer(state = initialState, action: any) {
    switch (action.type) {
        case DataActionTypes.FETCH_DATA: {
            return {
                ...state
             };
        }

        case DataActionTypes.INITIALIZE: {
            const newState = action.payload;
            return {
                ...state,
                ...newState
             };
        }

        case DataActionTypes.ADD_COMMENT: {
            const { destination, comment } = action.payload;
            const { area, table, row } = destination;

            const tableIdx = state[area]['tables'].indexOf(table);
            const tableToUpdate = state[area]['tables'][tableIdx];
            
            return {
                ...state
             };
        }

        // case DataActionTypes.FETCH_DATA_SUCCESS: {
        //     return {
        //         ...state,
        //         ...action.payload
        //      };
        // }

        // case DataActionTypes.FETCH_DATA: {
        //     return {
        //         ...state
        //      };
        // }

        // case DataActionTypes.FETCH_DATA_FAIL: {
        //     return {
        //         ...state,
        //         error: action.payload
        //      };
        // }

        default: {
            return state;
        }
    }
}

export const reducers: ActionReducerMap<DataState> = {
    source: sourceReducer,
    target: targetReducer,
};

export const getDataState = createFeatureSelector<DataState>('data');

export const getSourceState = createSelector(
    getDataState,
    (state: DataState) => state.source
);
export const getSourceTables = createSelector(
    getSourceState,
    fromSource.getSourceTables
);
export const getSourceRows = createSelector(
    getSourceState,
    fromSource.getSourceRows
);
export const getSourceComments = createSelector(
    getSourceState,
    fromSource.getSourceRows
);


export const getTargetState = createSelector(
    getDataState,
    (state: DataState) => state.target
);
export const getTargetTables = createSelector(
    getTargetState,
    fromTarget.getTargetTables
);
export const getTargetRows = createSelector(
    getTargetState,
    fromTarget.getTargetRows
);
export const getTargetComments = createSelector(
    getTargetState,
    fromTarget.getTargetRows
);