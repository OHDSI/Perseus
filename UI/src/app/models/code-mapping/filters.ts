import { Filter } from '../filter/filter';
import { ImportCodesService } from '../../services/import-codes/import-codes.service';
import { FormControl, FormGroup } from '@angular/forms';

const dropdownFilters: Filter[] = [
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

export function getFilters(): Filter[] {
  return dropdownFilters.map(filter => ({...filter}))
}

export function fillFilters(filters: Filter[], importCodesService: ImportCodesService) {
  importCodesService.fetchFilters()
    .subscribe(result =>
      Object.keys(result).forEach(key =>
        filters.find(filter => filter.field === key).values = result[key]
      )
    )
}

export function createFiltersForm() {
  return new FormGroup({
    filterByUserSelectedConceptsAtcCode: new FormControl(false),
    filterStandardConcepts: new FormControl(false),
    includeSourceTerms: new FormControl(false),
    filterByConceptClass: new FormControl(false),
    filterByVocabulary: new FormControl(false),
    filterByDomain: new FormControl(false),
    conceptClasses: new FormControl([]),
    vocabularies: new FormControl([]),
    domains: new FormControl([])
  })
}
