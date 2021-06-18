import { Injectable } from '@angular/core';
import { VocabSearchState } from '@models/vocabulary-search/vocabulary-search-state';
import { StateService } from '@services/state/state.service';

@Injectable()
export class VocabularySearchStateService implements StateService {

  private searchState: VocabSearchState;

  constructor() { }

  get state() {
    return this.searchState;
  }

  set state(state: VocabSearchState) {
    this.searchState = state;
  }

  reset() {
    this.searchState = null
  }
}
