import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

import * as domain from '../../assets/vocabularies/domainlist.json';
import * as lookup from '../../assets/vocabularies/lookuplist.json';
import * as concept from '../../assets/vocabularies/conceptlist.json';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

const URL = environment.url;

@Injectable()
export class VocabulariesService {
  batch = [];

  constructor(private httpClient: HttpClient) {}

  // dictionary setup
  setVocabularyConnectionString(): Observable<any> {
    const url = `${URL}/set_db_connection`;
    const headers = new HttpHeaders({
      'connection-string': 'postgres:root@10.110.1.76:5432/Vocabulary'
    });
    return this.httpClient.get(url, { headers, responseType: 'text' });
  }

  getVocabularies(): Observable<IVocabulary[]> {
    if (environment.production) {
      const batch = [];
      batch.push(
        this.httpClient.get(`${URL}/get_domain_list`).pipe(
          map(d => {
            return { name: 'domain', payload: d };
          })
        )
      );
      batch.push(
        this.httpClient.get(`${URL}/get_lookup_list`).pipe(
          map(d => {
            return { name: 'lookup', payload: d };
          })
        )
      );
      batch.push(
        this.httpClient.get(`${URL}/get_concept_class_list`).pipe(
          map(d => {
            return { name: 'concept', payload: d };
          })
        )
      );

      return forkJoin(batch);
    } else {
      return of([
        { name: 'domain', payload: domain.domain },
        { name: 'lookup', payload: lookup.lookup },
        { name: 'concept', payload: concept.concepts }
      ]);
    }
  }
}

export interface IVocabulary {
  name: string;
  payload: string[];
}

