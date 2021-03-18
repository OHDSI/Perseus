import { Concept } from 'src/app/cdm/mapping/concept-transformation/model/concept';

export function getConceptFieldNameByType(columnType: string, connectedToConceptFields: any) {
  let names = connectedToConceptFields.filter(it => it.endsWith(columnType));
  if (columnType === 'concept_id') {
    names = names.filter(it => !it.endsWith('source_concept_id') && !it.endsWith('type_concept_id'));
  }
  return names[0];
}


export function createConceptField(fields, fieldName: string, targetFieldName: string, clone?: string, condition?: string) {
  fields[fieldName] = {
    field: '',
    targetFieldName,
    targetCloneName: clone,
    sql: '',
    sqlApplied: false,
    constant: '',
    selected: false,
    constantSelected: true,
    condition,
    alreadySelected: false
  };
}

export function createConceptFields(conceptFields: any, clone?: string, condition?: string) {
  const fields = {};
  createConceptField(fields, 'concept_id', getConceptFieldNameByType('concept_id', conceptFields), clone, condition);
  createConceptField(fields, 'source_value', getConceptFieldNameByType('source_value', conceptFields), clone, condition);
  createConceptField(fields, 'source_concept_id', getConceptFieldNameByType('source_concept_id', conceptFields), clone, condition);
  createConceptField(fields, 'type_concept_id', getConceptFieldNameByType('type_concept_id', conceptFields), clone, condition);
  return fields;
}


export function getConceptFieldType(fieldName: string) {
  return fieldName.endsWith('type_concept_id') ? 'type_concept_id' :
      fieldName.endsWith('source_concept_id') ? 'source_concept_id' :
          fieldName.endsWith('source_value') ? 'source_value' :
              'concept_id';
}


export function updateConceptsList(conceptsList: Concept[]) {
  return conceptsList.filter(conc => conceptFieldHasAnyValue(conc, 'concept_id') ||
      conceptFieldHasAnyValue(conc, 'source_value') ||
      conceptFieldHasAnyValue(conc, 'type_concept_id') ||
      conceptFieldHasAnyValue(conc, 'source_concept_id'))
}

export function conceptFieldHasAnyValue(conc: Concept, fieldType: string) {
  return !!conc.fields[ fieldType ].field || !!conc.fields[ fieldType ].constant;
}

export function updateConceptsIndexes(concepts: Concept[]) {
  concepts.forEach((conc, index) => {
    conc.id = index;
  });
}

