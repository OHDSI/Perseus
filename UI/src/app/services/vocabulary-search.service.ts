import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Concept } from '../vocabulary-search/concept';

export interface VocabSearchReqParams {
  pageSize: number;
  pageNumber: number;
  query?: string;
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

  constructor(private httpClient: HttpClient) { }

  search(params: VocabSearchReqParams): Observable<VocabSearchResult> {
    const url = 'https://athena.ohdsi.org/api/v1/concepts';
    return this.httpClient.get<VocabSearchResult>(
      `${url}?pageSize=${params.pageSize}&page=${params.pageNumber}&query=${params.query}`
    );
  }
}
