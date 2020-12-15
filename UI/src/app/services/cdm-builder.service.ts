import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CdmBuilderStatus } from '../scan-data/model/cdm-builder-status';
import { cdmBuilderApiUrl } from '../app.constants';
import { CdmSettings } from '../scan-data/model/cdm-settings';
import { map, switchMap } from 'rxjs/operators';
import { ConnectionResult } from '../scan-data/model/connection-result';
import { DataService } from './data.service';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class CdmBuilderService {

  constructor(private httpClient: HttpClient,
              private dataService: DataService,
              private bridgeService: BridgeService,
              private storeService: StoreService) {
  }

  status(): Observable<CdmBuilderStatus> {
    return this.httpClient.get(cdmBuilderApiUrl, {observe: 'response', responseType: 'text'})
      .pipe(
        map((response: HttpResponse<any>) => response.body as CdmBuilderStatus)
      );
  }

  testSourceConnection(settings: CdmSettings): Observable<ConnectionResult> {
    return this.testConnection(settings, `${cdmBuilderApiUrl}/checksourceconnection`);
  }

  testDestinationConnection(settings: CdmSettings): Observable<ConnectionResult> {
    return this.testConnection(settings, `${cdmBuilderApiUrl}/checkdestinationconnection`);
  }

  addMapping(): Observable<boolean> {
    const source = this.storeService.state.source;
    const mappingJSON = this.bridgeService.getMappingWithViewsAndGroups(source);

    return this.dataService.getZippedXml(mappingJSON)
      .pipe(
        switchMap(file => {
          const formData = new FormData();
          formData.append('File', file);
          formData.append('Name', 'TestMappings');
          return this.httpClient.post(`${cdmBuilderApiUrl}/addmappings`, formData, {observe: 'response'});
        }),
        map(response => response.status === 200)
      );
  }

  convert(settings: CdmSettings): Observable<boolean> {
    return this.httpClient.post(cdmBuilderApiUrl, settings, {headers: {'Content-Type': 'application/json'}})
      .pipe(
        map(response => {
          console.log(response);
          return true;
        })
      );
  }

  abort(): Observable<boolean> {
    return this.httpClient.get(`${cdmBuilderApiUrl}/abort`, {observe: 'response'})
      .pipe(
        map(response => response.status === 200)
      );
  }

  private testConnection(settings: CdmSettings, url: string): Observable<ConnectionResult> {
    return this.httpClient.post<ConnectionResult>(url, settings, {observe: 'response'})
      .pipe(
        map((response: HttpResponse<any>) => response.status === 200 ? {
          canConnect: true,
          message: 'Success'
        } : {
          canConnect: false,
          message: 'Error'
        })
      );
  }
}
