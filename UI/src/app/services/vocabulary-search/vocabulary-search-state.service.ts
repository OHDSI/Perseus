import { Injectable } from '@angular/core';
import { VocabSearchState } from '../../models/vocabulary-search/vocabulary-search-state';

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
