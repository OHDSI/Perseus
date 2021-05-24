import { VocabSearchMode, VocabSearchReqParams } from './vocabulray-search';
import { FilterValue } from '../../shared/filters/filter-dropdown/filter-list/filter-list.component';
import { Concept } from './concept';
import { Filter } from '../../shared/filters/filter-dropdown/filter-dropdown-label/filter-dropdown-label.component';

export interface VocabSearchState {
  requestParams: VocabSearchReqParams;
  mode: VocabSearchMode;
  selectedFilters: FilterValue[];
  concepts: Concept[];
  currentPage: number;
  pageCount: number;
  pageSize: number;
  filters: Filter[];
  movableIndexes: {second: number; third: number};
  sort: { field: string; order: string };
}
