import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { usagiUrl } from '@app/app.constants';
import { ImportCodesState } from '@models/code-mapping/import-codes-state';

@Injectable()
export class ImportVocabulariesService {

  constructor(private httpClient: HttpClient) { }

  nameList(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${usagiUrl}/snapshot/names`)
  }

  loadByName(name: string): Observable<ImportCodesState> {
    return this.httpClient.get<ImportCodesState>(`${usagiUrl}/snapshot?name=${name}`)
  }

  removeByName(name: string): Observable<void> {
    return this.httpClient.delete<void>(`${usagiUrl}/snapshot?name=${name}`)
  }
}
