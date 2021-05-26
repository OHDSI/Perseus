import { Filter } from '../../../../models/filter/filter';

export const dropdownFilters: Filter[] = [
  {
    field: 'conceptClasses',
    checkboxField: 'filterByConceptClass',
    name: 'By concept class',
    color: '#E99A00',
    values: []
  },
  {
    field: 'vocabularies',
    checkboxField: 'filterByVocabulary',
    name: 'By vocabulary',
    color: '#3D00BD',
    values: []
  },
  {
    field: 'domains',
    checkboxField: 'filterByDomain',
    name: 'By domain',
    color: '#00A6BD',
    values: []
  }
]
