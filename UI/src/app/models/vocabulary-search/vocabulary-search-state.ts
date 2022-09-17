import { VocabSearchMode, VocabSearchReqParams } from './vocabulray-search';
import { Concept } from './concept';
import { Filter, FilterValue } from '../filter/filter';
import { Sort } from '@models/grid/grid'

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
  sort: Sort;
  total: number
}
