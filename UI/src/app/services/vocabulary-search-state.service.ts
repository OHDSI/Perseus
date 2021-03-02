import { Injectable } from '@angular/core';
import { VocabSearchMode, VocabSearchReqParams } from './vocabulary-search.service';
import { FilterValue } from '../vocabulary-search/filter-list/filter-list.component';

export interface VocabSearchState {
  requestParams: VocabSearchReqParams;
  mode: VocabSearchMode;
  selectedFilters: FilterValue[];
}

@Injectable({
  providedIn: 'root'
})
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
