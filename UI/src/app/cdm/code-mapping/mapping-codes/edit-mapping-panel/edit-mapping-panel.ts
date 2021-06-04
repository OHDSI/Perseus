import { filterValueToString, SearchConceptFilters } from '../../../../models/code-mapping/search-concept-filters';
import { isEqual } from '../../../../infrastructure/utility';
import { Concept } from '../../../../models/code-mapping/concept';
import { ScoredConcept } from '../../../../models/code-mapping/scored-concept';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { SearchByTermParams } from '../../../../models/code-mapping/search-by-term-params';
import { termFromTargetConcept } from '../../../../models/code-mapping/target-concept';

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
    const prevBool = prev[fields.booleansField]
    const currBool = curr[fields.booleansField]

    if (prevBool && currBool) {
      const prevArray = prev[fields.arrayField].map(filterValueToString)
      const currArray = curr[fields.arrayField].map(filterValueToString)
      if (!isEqual(prevArray, currArray)) {
        return true
      }
    } else if (!prevBool && currBool || prevBool && !currBool) {
      if (curr[fields.arrayField].length) {
        return true
      }
    }
  }

  return false
}

export function toScoredConceptWithSelection(scoredConcepts: ScoredConcept[], selectedConcepts: Concept[]): ScoredConcept[] {
  return scoredConcepts.map(
    scoredConcept => selectedConcepts.find(concept => concept.conceptId === scoredConcept.concept.conceptId && concept.term === scoredConcept.term[0])
      ? {...scoredConcept, selected: true}
      : {...scoredConcept, selected: false}
  )
}

export function toSearchByTermParams(term: string, codeMapping: CodeMapping): SearchByTermParams {
  const selectedConcepts = codeMapping.targetConcepts.map(targetConcept => ({
    ...targetConcept.concept,
    term: termFromTargetConcept(targetConcept)
  }))
  const sourceAutoAssignedConceptIds = codeMapping.sourceCode.source_auto_assigned_concept_ids
  return  {
    term,
    sourceAutoAssignedConceptIds,
    selectedConcepts
  }
}
