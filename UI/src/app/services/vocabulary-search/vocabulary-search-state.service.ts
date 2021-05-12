import { Injectable } from '@angular/core';
import { VocabSearchMode, VocabSearchReqParams } from './vocabulary-search.service';
import { FilterValue } from '../../vocabulary-search/filter-list/filter-list.component';
import { Concept } from '../../models/vocabulary-search/concept';
import { Filter } from '../../vocabulary-search/filter-item/filter-item.component';

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

@Injectable()
export class VocabularySearchStateService {

  private searchState: VocabSearchState;

  constructor() { }

  get state() {
    return this.searchState;
  }

  set state(state: VocabSearchState) {
    this.searchState = state;
  }
}
