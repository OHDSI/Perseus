export interface TargetState {
    tables: [];
    rows: [];
    comments: [];
}

export const initialState: TargetState = {
    tables: [],
    rows: [],
    comments: []
};

export function targetReducer(state: TargetState, action: any) {
    switch (action.type) {
        default: {
            return state;
        }
    }
}

export const getTargetTables = (state: TargetState) => state.tables;
export const getTargetRows = (state: TargetState) => state.rows;
export const getTargetComments = (state: TargetState) => state.comments;
