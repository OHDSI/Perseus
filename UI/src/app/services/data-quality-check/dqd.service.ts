import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { dqdApiUrl } from '@app/app.constants';

@Injectable()
export class DqdService {

  constructor(private httpClient: HttpClient) { }

  dataQualityCheck(dbSettings: DbSettings, userId: string): Observable<void> {
    return this.httpClient.post<void>(`${dqdApiUrl}/${userId}`, dbSettings);
  }

  getResult(userId: string): Observable<{successfully: boolean, payload: string}> {
    return this.httpClient.get<{successfully: boolean, payload: string}>(`${dqdApiUrl}/${userId}`);
  }

  cancel(userId: string): Observable<void> {
    return this.httpClient.get<void>(`${dqdApiUrl}/cancel/${userId}`);
  }

  download(fileName: string): Observable<string> {
    return this.httpClient.get<string>(`${dqdApiUrl}/download/${fileName}`);
  }
}
