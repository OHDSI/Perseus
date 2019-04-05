import { SourceActionTypes } from 'src/app/store/actions/source.actions';

export interface SourceState {
    tables: [];
    rows: [];
    comments: [];
}

export const initialState: SourceState = {
    tables: [],
    row: [],
    comments: []
};

export function sourceReducer(state = initialState, action: any) {
    switch (action.type) {
        case SourceActionTypes.INITIALIZE: {
            const t = action.payload;
            return {
                ...state
             };
        }

        default: {
            return state;
        }
    }
}

export const getSourceTables = (state: SourceState) => state.tables;
export const getSourceRows = (state: SourceState) => state.rows;
export const getSourceComments = (state: SourceState) => state.comments;
