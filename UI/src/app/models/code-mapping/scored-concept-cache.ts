import { ScoredConcept } from './scored-concept';
import { SearchConceptFilters } from './search-concept-filters';
import { SearchMode } from './search-mode';

export interface ScoredConceptCache {
  concepts: ScoredConcept[],
  filters: SearchConceptFilters,
  searchMode: SearchMode
}
