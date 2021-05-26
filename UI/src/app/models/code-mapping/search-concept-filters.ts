import { SearchMode } from './search-mode';
import { FilterValue } from '../filter/filter';

export interface SearchConceptFilters {
  searchString: string,
  searchMode: SearchMode,
  filterByUserSelectedConceptsAtcCode: boolean,
  filterStandardConcepts: boolean,
  includeSourceTerms: boolean,
  filterByConceptClass: boolean,
  filterByVocabulary: boolean,
  filterByDomain: boolean,
  conceptClasses: string[],
  vocabularies: string[],
  domains: string[]
}

export function filterValueToString(filterValue: FilterValue): string {
  return filterValue.name
}

const defaultSearchConceptFilters: SearchConceptFilters = {
  searchString: '',
  searchMode: SearchMode.SEARCH_TERM_AS_QUERY,
  filterByUserSelectedConceptsAtcCode: false,
  filterStandardConcepts: false,
  includeSourceTerms: false,
  filterByConceptClass: false,
  filterByVocabulary: false,
  filterByDomain: false,
  conceptClasses: [],
  vocabularies: [],
  domains: []
}

export function getDefaultSearchConceptFilters() {
  return {...defaultSearchConceptFilters}
}
