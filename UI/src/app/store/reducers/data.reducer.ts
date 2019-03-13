
import { DataActionTypes, DataAction } from 'src/app/store/actions/data.actions';
import { SourceTable } from 'src/app/models/sourceTable';

export interface State {
    sourceTable: SourceTable;
}

export const initialState: State = {
    sourceTable: {
        domain_id: '',
        person_id: '',
        visit_occurence_id: '',
        provider_id: '',
        id: '',
        concept_id: '',
        source_value: '',
        source_concept_id: '',
        type_concept_id: '',
        start_date: '',
        start_datetime: ''
    }

}

export function dataReducer(state = initialState, action: DataAction) {
    switch (action.type) {
        case DataActionTypes.LOAD_DATA: {
            return {
                ...state
             };
        }

        case DataActionTypes.LOAD_DATA_SUCCESS: {
            return {
                ...state,
                sourceTable: action.payload
             };
        }

        default: {
            return state;
          }
    }
}