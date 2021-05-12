import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.constants';
import { ImportCodesState } from './import-codes.service';

@Injectable()
export class ImportVocabulariesService {

  constructor(private httpClient: HttpClient) { }

  all(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${apiUrl}/get_vocabulary_list`)
  }

  get(name: string): Observable<ImportCodesState> {
    return this.httpClient.get<ImportCodesState>(`${apiUrl}/get_vocabulary?name=${name}`)
  }

  remove(name: string): Observable<void> {
    return this.httpClient.delete<void>(`${apiUrl}/delete_vocabulary?name=${name}`)
  }
}
