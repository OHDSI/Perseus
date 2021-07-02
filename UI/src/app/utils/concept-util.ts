import { Concept, IConceptField, IConceptFields } from '@models/concept-transformation/concept';
import { IRow } from '@models/row';
import * as conceptMap from '../cdm/mapping/concept-fileds-list.json';
import { environment } from '../../environments/environment';
import { IConnector } from '@models/connector.interface';
import { conceptFieldsTypes } from '@app/app.constants';

const conceptFieldNames = (conceptMap as any).default;

export function getConceptFieldNameByType(columnType: string, connectedToConceptFields: any) {
  let names = connectedToConceptFields.filter(it => it.endsWith(columnType));
  if (columnType === 'concept_id') {
    names = names.filter(it => !it.endsWith('source_concept_id') && !it.endsWith('type_concept_id'));
  }
  return names[0];
}


export function createConceptField(targetFieldName: string, clone?: string, condition?: string) {
  const conceptOptions: IConceptField = {
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
  return conceptOptions;
}

export function createConceptFields(conceptFields: any, clone?: string, condition?: string) {
  const fields: IConceptFields = {
    concept_id: createConceptField(getConceptFieldNameByType('concept_id', conceptFields), clone, condition),
    source_value: createConceptField(getConceptFieldNameByType('source_value', conceptFields), clone, condition),
    source_concept_id: createConceptField(getConceptFieldNameByType('source_concept_id', conceptFields), clone, condition),
    type_concept_id: createConceptField(getConceptFieldNameByType('type_concept_id', conceptFields), clone, condition)
  };
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

export function toNoConceptRows(rows: IRow[]): IRow[] {
  return rows
    .filter(r => !conceptFieldNames[r.tableName]?.includes(r.name))
}

const CONCEPT_COLUMNS = [
  'CONCEPT_ID',
  'SOURCE_CONCEPT_ID',
  'TYPE_CONCEPT_ID',
  'SOURCE_VALUE'
];

export const isConceptTable = (tableName: string): boolean => {
  return environment.conceptTables.findIndex(name => tableName === name) > -1;
};

export const isConcept = (connector: IConnector): boolean => {
  return CONCEPT_COLUMNS.findIndex(name => connector.target.name.indexOf(name) > -1) > -1;
};

export function getConceptFieldsDictionary(conceptFields: any) {
  const conceptFieldsDictionary = {};
  conceptFieldsTypes.forEach(it => {
    conceptFieldsDictionary[ it ] = getConceptFieldNameByType(it, conceptFields);
  })
  return conceptFieldsDictionary;
}
