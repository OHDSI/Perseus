import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Concept } from '../vocabulary-search/concept';

export interface VocabSearchReqParams {
  pageSize: number;
  pageNumber: number;
  query?: string;
  sort?: string;
  order?: string;
  domain?: string[];
  standardConcept?: string[];
  conceptClass?: string[];
  vocabulary?: string[];
  invalidReason?: string[];
  updateFilters?: boolean;
}

export interface VocabSearchFilters {
  [key: string]: {
    [key: string]: number
  };
}

export interface VocabSearchResult {
  content: Concept[];
  facets: VocabSearchFilters;
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class VocabularySearchService {

  private mandatoryParams = [
    'pageSize',
    'pageNumber'
  ];

  constructor(private httpClient: HttpClient) {
  }

  search(params: VocabSearchReqParams): Observable<VocabSearchResult> {
    const url = 'https://athena.ohdsi.org/api/v1/concepts';

    const urlWithMandatoryParams = `${url}?pageSize=${params.pageSize}&page=${params.pageNumber}`;

    const urlWithAllParams = urlWithMandatoryParams + Object
      .keys(params)
      .filter(key =>  params[key] as boolean && params[key].length > 0 && !this.mandatoryParams.includes(key))
      .map(key => `&${key}=${typeof params[key] === 'string' ? params[key] : params[key].join(',')}`)
      .join('');

    return this.httpClient.get<VocabSearchResult>(urlWithAllParams);
  }
}
