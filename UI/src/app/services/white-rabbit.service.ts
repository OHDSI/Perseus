import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionResult } from '../scan-data/model/connection-result';
import { DbSettings } from '../scan-data/model/db-settings';
import { HttpClient } from '@angular/common/http';
import { whiteRabbitApiUrl } from '../app.constants';
import { TableToScan } from '../scan-data/model/table-to-scan';
import { map } from 'rxjs/operators';
import { DelimitedTextFileSettings } from '../scan-data/model/delimited-text-file-settings';
import { FakeDataParams } from '../scan-data/model/fake-data-params';

@Injectable({
  providedIn: 'root'
})
export class WhiteRabbitService {

  constructor(private http: HttpClient) {
  }

  testConnection(dbSettings: DbSettings): Observable<ConnectionResult> {
    return this.http.post<ConnectionResult>(`${whiteRabbitApiUrl}/test-connection`, dbSettings);
  }

  tablesInfo(dbSettings: DbSettings): Observable<TableToScan[]> {
    return this.http.post<{tableNames: string[]}>(`${whiteRabbitApiUrl}/tables-info`, dbSettings)
      .pipe(
        map(tablesInfo => tablesInfo.tableNames.map(tableName => ({
          tableName,
          selected: true
        })))
      );
  }

  generateScanReportByDb(dbSettings: DbSettings, userId: string): Observable<void> {
    return this.http.post<void>(`${whiteRabbitApiUrl}/scan-report/db/${userId}`, dbSettings)
  }

  generateScanReportByFiles(fileSettings: DelimitedTextFileSettings, userId: string, files: File[]): Observable<void> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file))
    formData.append('settings', JSON.stringify(fileSettings))

    return this.http.post<void>(`${whiteRabbitApiUrl}/scan-report/files/${userId}`, formData)
  }

  /* Return scan-report file server location */
  result(userId: string): Observable<string> {
    return this.http.get<{payload: string}>(`${whiteRabbitApiUrl}/scan-report/result/${userId}`)
      .pipe(
        map(result => result.payload)
      )
  }

  downloadScanReport(fileLocation: string): Observable<Blob> {
    return this.http.get<Blob>(`${whiteRabbitApiUrl}/scan-report/${fileLocation}`, {
      responseType: 'blob' as 'json'
    })
  }

  generateFakeData(fakeDataSettings: FakeDataParams, userId: string, scanReport: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', scanReport)
    formData.append('settings', JSON.stringify(fakeDataSettings))
    return this.http.post<void>(`${whiteRabbitApiUrl}/fake-data/${userId}`, formData)
  }

  abort(userId: string): Observable<void> {
    return this.http.get<void>(`${whiteRabbitApiUrl}/scan-report/abort/${userId}`)
  }
}
