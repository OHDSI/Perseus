import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private dataService: DataService, private httpService: HttpService) { }

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

  saveLookup(lookup, lookupType): Observable<any> {
    const { name, value } = lookup;
    return this.httpService.saveLookup({ name, value, lookupType });
  }

  deleteLookup(name, lookupType): Observable<any> {
    return this.httpService.deleteLookup(name, lookupType);
  }
}
