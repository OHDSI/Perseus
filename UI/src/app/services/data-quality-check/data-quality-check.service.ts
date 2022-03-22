import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { dqdApiUrl, dqdServerUrl } from '@app/app.constants';
import { Conversion } from '@models/conversion/conversion'
import { authInjector } from '@services/auth/auth-injector'
import { AuthService } from '@services/auth/auth.service'
import { ConnectionResult } from '@models/white-rabbit/connection-result'

@Injectable()
export class DataQualityCheckService {

  constructor(private httpClient: HttpClient,
              @Inject(authInjector) private authService: AuthService) { }

  testConnection(dbSettings: DbSettings): Observable<ConnectionResult> {
    return this.httpClient.post<ConnectionResult>(`${dqdApiUrl}/test-connection`, dbSettings)
  }

  dataQualityCheck(dbSettings: DbSettings): Observable<Conversion> {
    return this.httpClient.post<Conversion>(`${dqdApiUrl}/scan`, dbSettings)
  }

  abort(scanId: number): Observable<void> {
    return this.httpClient.get<void>(`${dqdApiUrl}/abort/${scanId}`)
  }

  scanInfoWithLogs(scanId: number): Observable<Conversion> {
    return this.httpClient.get<Conversion>(`${dqdApiUrl}/scan/${scanId}`)
  }

  downloadJsonResultFile(scanId: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`${dqdApiUrl}/result/${scanId}`)
  }

  resultPageUrl(scanId: number): string {
    const username = this.authService.user.email
    return `${dqdServerUrl}/?scanId=${scanId}&username=${username}`
  }
}
