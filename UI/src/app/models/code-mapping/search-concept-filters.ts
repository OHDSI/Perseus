import { SearchMode } from './search-mode';
import { FilterValue } from '../filter/filter';

export interface SearchConceptFilters {
  searchString?: string,
  searchMode?: SearchMode,
  filterByUserSelectedConceptsAtcCode: boolean,
  filterStandardConcepts: boolean,
  includeSourceTerms: boolean,
  filterByConceptClass: boolean,
  filterByVocabulary: boolean,
  filterByDomain: boolean,
  conceptClasses: string[] | FilterValue[],
  vocabularies: string[] | FilterValue[],
  domains: string[] | FilterValue[]
}

export function filterValueToString(filterValue: FilterValue): string {
  return filterValue.name
}

export function defaultSearchConceptFilters(): SearchConceptFilters {
  return {
    searchString: null,
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
}

/**
 * conceptClasses, vocabularies, domains - FilterValue[]
 */
export function mapFormFiltersToBackEndFilters(filters, searchMode: SearchMode = null): SearchConceptFilters {
  const result = {
    ...filters,
    conceptClasses: filters.conceptClasses?.map(filterValueToString) ?? [],
    vocabularies: filters.vocabularies?.map(filterValueToString) ?? [],
    domains: filters.domains?.map(filterValueToString) ?? []
  }

  return searchMode ? {...result, searchMode} : result
}

export const defaultSearchMode = SearchMode.SEARCH_TERM_AS_QUERY

export function defaultFiltersAnSearchMode() {
  return {filters: defaultSearchConceptFilters(), searchMode: defaultSearchMode}
}
