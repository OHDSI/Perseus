import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { perseusApiUrl } from '@app/app.constants'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class PerseusLookupService {
  constructor(private httpClient: HttpClient) { }

  getLookup(name: string, lookupType: string): Observable<string> {
    return this.httpClient.get<string>(`${perseusApiUrl}/get_lookup`, { params: { name , lookupType} });
  }

  getLookupTemplate(lookupType: string): Observable<string> {
    const name = `template_${lookupType}`;
    return this.getLookup(name, lookupType);
  }

  getLookupsList(lookupType: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${perseusApiUrl}/get_lookups_list`, { params: { lookupType } });
  }

  saveLookup(lookup, lookupType, lookupName?): Observable<any> {
    const { value } = lookup;
    const name = lookupName || lookup['name']
    return this.httpClient.post(`${perseusApiUrl}/save_lookup`, { name, value, lookupType });
  }

  deleteLookup(name: string, lookupType: string): Observable<void> {
    return this.httpClient.delete<void>(`${perseusApiUrl}/delete_lookup`, { params: { name , lookupType } });
  }
}
