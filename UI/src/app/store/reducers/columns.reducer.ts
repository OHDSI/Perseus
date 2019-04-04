import { ColumnsActionTypes, ColumnsAction } from 'src/app/store/actions/columns.actions';

export interface State {
   source: {},
   target: {}
}

export class ColumnsState {
    source: {};
    target: {};
}


export function columnsReducer(state = { source: {}, target: {}}, action: ColumnsAction) {
    switch (action.type) {
        case ColumnsActionTypes.INITIALIZE_COLUMNS: {
            const { area, table, columns } = action.payload;
            state[area][table] = {};
            state[area][table].columns = columns;

            return {
                ...state
             };
        }

        default: {
            return state;
          }
    }
}
