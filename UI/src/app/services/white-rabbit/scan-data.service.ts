import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionResult } from '../../scan-data/model/connection-result';
import { DbSettings } from '../../scan-data/model/db-settings';
import { HttpClient } from '@angular/common/http';
import { whiteRabbitApiUrl } from '../../app.constants';
import { TableToScan } from '../../scan-data/model/table-to-scan';
import { map } from 'rxjs/operators';
import { DelimitedTextFileSettings } from '../../scan-data/model/delimited-text-file-settings';

@Injectable({
  providedIn: 'root'
})
export class ScanDataService {

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

  generateScanReportByFiles(fileSettings: DelimitedTextFileSettings, userId: string): Observable<void> {
    const formData = new FormData();
    const settings = {
      fileType: fileSettings.fileType,
      delimiter: fileSettings.delimiter,
      scanParams: fileSettings.scanParams
    }
    formData.append('settings', JSON.stringify(settings))
    fileSettings.files.forEach(file => formData.append('files', file))

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

  abort(userId: string): Observable<void> {
    return this.http.get<void>(`${whiteRabbitApiUrl}/scan-report/abort/${userId}`)
  }
}
