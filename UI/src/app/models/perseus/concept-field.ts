export interface IConceptField {
    field: string;
    targetFieldName: string;
    targetCloneName: string;
    sql: string;
    sqlApplied: boolean;
    constant: string;
    selected: boolean;
    constantSelected: boolean;
    condition: string;
    alreadySelected: boolean;
}

export interface IConceptFields {
    concept_id: IConceptField;
    source_value: IConceptField;
    source_concept_id: IConceptField;
    type_concept_id: IConceptField;
}
