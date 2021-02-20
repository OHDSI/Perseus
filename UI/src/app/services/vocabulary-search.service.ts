import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

export interface VocabSearchReqParams {
  pageSize: number;
  pageNumber: number;
  query?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VocabularySearchService {

  constructor(private httpClient: HttpClient) { }

  search(params: VocabSearchReqParams): Observable<any> {
    const url = 'https://athena.ohdsi.org/api/v1/concepts';
    return this.httpClient.get(
      `${url}?pageSize=${params.pageSize}&page=${params.pageNumber}&query=${params.query ?? ''}`
    );
  }
}
