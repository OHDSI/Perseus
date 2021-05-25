import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { apiUrl } from '../../app.constants';
import {
  VocabSearchMode,
  VocabSearchReqParams,
  VocabSearchResult
} from '../../models/vocabulary-search/vocabulray-search';

@Injectable()
export class VocabularySearchService {

  private mandatoryParams = [
    'pageSize',
    'pageNumber',
    'updateFilters'
  ];

  private url = (mode: VocabSearchMode) => {
    if (mode === VocabSearchMode.LOCAL) {
      return `${apiUrl}/search_concepts`;
    } else {
      return 'https://athena.ohdsi.org/api/v1/concepts';
    }
  }

  constructor(private httpClient: HttpClient) {
  }

  search(params: VocabSearchReqParams, mode: VocabSearchMode): Observable<VocabSearchResult> {
    const urlWithMandatoryParams = `${this.url(mode)}?pageSize=${params.pageSize}&page=${params.pageNumber}&updateFilters=${params.updateFilters}`;

    const lengthNotZero = (value: string | string[]) => value?.length > 0;
    const isSecondaryFields = (field: string) => !this.mandatoryParams.includes(field);
    const parseFromStringOrArray = (value: string | string[]) => typeof value === 'string' ? value : value.join(',');

    const urlWithAllParams = urlWithMandatoryParams + Object
      .keys(params)
      .filter(key => isSecondaryFields(key) && lengthNotZero(params[key]))
      .map(key => `&${key}=${parseFromStringOrArray(params[key])}`)
      .join('');

    return this.httpClient.get<VocabSearchResult>(urlWithAllParams);
  }
}
