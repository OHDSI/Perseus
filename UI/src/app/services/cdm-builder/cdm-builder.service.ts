import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CdmBuilderStatus } from '@models/cdm-builder/cdm-builder-status';
import { cdmBuilderApiUrl } from '@app/app.constants';
import { CdmSettings } from '@models/cdm-builder/cdm-settings';
import { map, switchMap } from 'rxjs/operators';
import { ConnectionResult } from '@models/white-rabbit/connection-result';
import { DataService } from '../data.service';
import { BridgeService } from '../bridge.service';
import { StoreService } from '../store.service';
import { removeExtension } from '@utils/file';
import { authInjector } from '../auth/auth-injector';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CdmBuilderService {

  constructor(private httpClient: HttpClient,
              private dataService: DataService,
              private bridgeService: BridgeService,
              private storeService: StoreService,
              @Inject(authInjector) private authService: AuthService) {
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
    const source = this.storeService.state.mappedSource;
    const mappingJSON = this.bridgeService.generateMappingWithViewsAndGroups(source);
    const mappingName = this.getMappingName();

    return this.dataService.getZippedXml(mappingJSON)
      .pipe(
        switchMap(file => {
          const formData = new FormData();
          formData.append('File', file);
          formData.append('Name', mappingName);
          return this.httpClient.post(`${cdmBuilderApiUrl}/addmappings`, formData, {observe: 'response'});
        }),
        map(response => response.status === 200)
      );
  }

  convert(settings: CdmSettings): Observable<boolean> {
    return this.httpClient.post(cdmBuilderApiUrl, settings, {headers: {'Content-Type': 'application/json'}, observe: 'response'})
      .pipe(
        map(response => response.status === 200)
      );
  }

  abort(): Observable<boolean> {
    return this.httpClient.get(`${cdmBuilderApiUrl}/abort`, {observe: 'response', responseType: 'text'})
      .pipe(
        map(response => response.status === 200)
      );
  }

  getMappingName(): string {
    const reportName = removeExtension(this.storeService.state.report)
    const email = this.authService.user.email

    return `${reportName}_${email}`
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
