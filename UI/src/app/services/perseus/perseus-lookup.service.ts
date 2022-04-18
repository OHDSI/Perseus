import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { perseusApiUrl } from '@app/app.constants'
import { HttpClient } from '@angular/common/http'
import { Lookup } from '@models/perseus/lookup'
import { LookupType } from '@models/perseus/lookup-type'
import { LookupRequest } from '@models/perseus/lookup-request'
import { LookupListItem } from '@models/perseus/lookup-list-item'

@Injectable()
export class PerseusLookupService {
  constructor(private httpClient: HttpClient) { }

  /**
   * @return predefined lookup sql
   */
  getLookupSqlByName(name: string, lookupType: LookupType): Observable<string> {
    if (!name) {
      return of('')
    }
    return this.httpClient.get<string>(`${perseusApiUrl}/lookup/sql`, { params: { name , lookupType} });
  }

  /**
   * @return user defined lookup sql
   */
  getLookupSqlById(id: number, lookupType: LookupType): Observable<string> {
    return this.httpClient.get<string>(`${perseusApiUrl}/lookup/sql`, { params: { id , lookupType} });
  }

  getTemplateLookupSql(lookupType: LookupType): Observable<string> {
    const name = `template_${lookupType}`;
    return this.getLookupSqlByName(name, lookupType);
  }

  /**
   * @return predefined lookups + user defined lookups names
   */
  getLookups(lookupType: LookupType): Observable<LookupListItem[]> {
    return this.httpClient.get<LookupListItem[]>(`${perseusApiUrl}/lookups`, { params: { lookupType } });
  }

  createLookup(lookup: LookupRequest): Observable<Lookup> {
    return this.httpClient.post<Lookup>(`${perseusApiUrl}/lookup`, lookup)
  }

  updateLookup(id: number, lookup: LookupRequest): Observable<Lookup> {
    return this.httpClient.put<Lookup>(`${perseusApiUrl}/lookup`, lookup, { params: { id } })
  }

  deleteLookup(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${perseusApiUrl}/lookup`, { params: { id } });
  }
}
