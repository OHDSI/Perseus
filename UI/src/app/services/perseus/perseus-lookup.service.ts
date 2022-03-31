import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { PerseusApiService } from './perseus-api.service';
import { perseusApiUrl } from '@app/app.constants'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class PerseusLookupService {
  constructor(private httpClient: HttpClient) { }

  getLookup(name, lookupType): Observable<string> {
    return this.httpClient.get<string>(`${perseusApiUrl}/get_lookup`, { params: { name , lookupType} });
  }

  getLookupTemplate(lookupType): Observable<string> {
    const name = `template_${lookupType}`;
    return this.getLookup(name, lookupType);
  }

  getLookupsList(lookupType): Observable<string[]> {
    return this.httpClient.get<string[]>(`${perseusApiUrl}/get_lookups_list`, { params: { lookupType } });
  }

  saveLookup(lookup, lookupType, lookupName?): Observable<any> {
    const { value } = lookup;
    const name = lookupName || lookup['name']
    return this.httpClient.post(`${perseusApiUrl}/save_lookup`, { name, value, lookupType });
  }

  deleteLookup(name, lookupType): Observable<any> {
    return this.httpClient.delete(`${perseusApiUrl}/delete_lookup`, { params: { name , lookupType } });
  }
}
