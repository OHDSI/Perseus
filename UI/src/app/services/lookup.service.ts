import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { PerseusApiService } from './perseus/perseus-api.service';

@Injectable()
export class LookupService {

  constructor(private dataService: DataService, private httpService: PerseusApiService) { }

  getLookup(name, lookupType): Observable<string> {
    return this.httpService.getLookup(name, lookupType);
  }

  getLookupTemplate(lookupType): Observable<string> {
    const name = `template_${lookupType}`;
    return this.httpService.getLookup(name, lookupType);
  }

  getLookupsList(lookupType): Observable<any> {
    return this.httpService.getLookupsList(lookupType);
  }

  saveLookup(lookup, lookupType, lookupName?): Observable<any> {
    const { value } = lookup;
    const name = lookupName || lookup['name']
    return this.httpService.saveLookup({ name, value, lookupType });
  }

  deleteLookup(name, lookupType): Observable<any> {
    return this.httpService.deleteLookup(name, lookupType);
  }
}
