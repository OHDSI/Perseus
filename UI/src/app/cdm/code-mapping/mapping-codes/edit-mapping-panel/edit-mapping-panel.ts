import { SearchConceptFilters } from '../../../../models/code-mapping/search-concept-filters';
import { isEqual } from '../../../../infrastructure/utility';

const baseFields = [
  'searchString',
  'filterByUserSelectedConceptsAtcCode',
  'filterStandardConcepts',
  'includeSourceTerms'
]

const advancedFields = [
  {
    booleansField: 'filterByConceptClass',
    arrayField: 'conceptClasses'
  },
  {
    booleansField: 'filterByVocabulary',
    arrayField: 'vocabularies'
  },
  {
    booleansField: 'filterByDomain',
    arrayField: 'domains'
  }
]

export function isFormChanged(prev: SearchConceptFilters, curr: SearchConceptFilters) {
  if (prev === null) {
    return true
  }

  for (const field of baseFields) {
    if (prev[field] !== curr[field]) {
      return true
    }
  }

  for (const fields of advancedFields) {
    if (prev[fields.booleansField] && curr[fields.booleansField]) {
      if (!isEqual(prev[fields.arrayField], curr[fields.arrayField])) {
        return true
      }
    } else if (!prev[fields.booleansField] && curr[fields.booleansField] || prev[fields.booleansField] && !curr[fields.booleansField]) {
      if (curr[fields.arrayField].length) {
        return true
      }
    }
  }

  return false
}
