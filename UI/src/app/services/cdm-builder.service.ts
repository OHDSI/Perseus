import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CdmBuilderStatus } from '../scan-data/model/cdm-builder-status';
import { cdmBuilderUrl } from '../app.constants';
import { CdmBuilderSettings } from '../scan-data/model/cdm-builder-settings';
import { map, switchMap } from 'rxjs/operators';
import { ConnectionResult } from '../scan-data/model/connection-result';
import { DataService } from './data.service';
import { Mapping } from '../models/mapping';

@Injectable({
  providedIn: 'root'
})
export class CdmBuilderService {

  constructor(private httpClient: HttpClient,
              private dataService: DataService) { }

  status(): Observable<CdmBuilderStatus> {
    return this.httpClient.get<CdmBuilderStatus>(cdmBuilderUrl);
  }

  testConnection(settings: CdmBuilderSettings): Observable<ConnectionResult> {
    return this.httpClient.post<ConnectionResult>(`${cdmBuilderUrl}/checksourceconnection`, settings, {observe: 'response'})
      .pipe(
        map(response => response.status === 200 ? {
          canConnect: true,
          message: 'Success'
        } : {
          canConnect: false,
          message: 'Error'
        })
      );
  }

  addMapping(mapping: Mapping): Observable<boolean> {
    return this.dataService.getZippedXml(mapping)
      .pipe(
        switchMap(file => {
          const formData = new FormData();
          formData.append('File', file);
          return this.httpClient.post(`${cdmBuilderUrl}/addmappings`, formData, {observe: 'response'});
        }),
        map(response => response.status === 200)
      );
  }

  convert(settings: CdmBuilderSettings): Observable<boolean> {
    return this.httpClient.post<boolean>(cdmBuilderUrl, settings, {observe: 'response'})
      .pipe(
        map(response => response.status === 200)
      );
  }
}
