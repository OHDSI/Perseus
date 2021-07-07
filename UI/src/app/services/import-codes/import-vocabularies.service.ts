import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '@app/app.constants';
import { ImportCodesState } from '@models/code-mapping/import-codes-state';

@Injectable()
export class ImportVocabulariesService {

  constructor(private httpClient: HttpClient) { }

  all(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${apiUrl}/get_vocabulary_list`)
  }

  prepareVocabulary(name: string): Observable<void> {
    return this.httpClient.get<void>(`${apiUrl}/get_vocabulary?name=${name}`)
  }

  getVocabulary(): Observable<ImportCodesState> {
    return this.httpClient.get<ImportCodesState>(`${apiUrl}/get_vocabulary_data`)
  }

  remove(name: string): Observable<void> {
    return this.httpClient.get<void>(`${apiUrl}/delete_vocabulary?name=${name}`)
  }
}
