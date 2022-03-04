import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionResult } from '@models/scan-data/connection-result';
import { DbSettings } from '@models/scan-data/db-settings';
import { HttpClient } from '@angular/common/http';
import { whiteRabbitApiUrl } from '@app/app.constants';
import { TableToScan } from '@models/scan-data/table-to-scan';
import { map } from 'rxjs/operators';
import { FilesSettings } from '@models/scan-data/files-settings';
import { ProgressLog } from '@models/progress-console/progress-log'
import { Conversion } from '@models/conversion/conversion'

@Injectable()
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

  generateScanReportByDb(dbSettings: DbSettings): Observable<Conversion> {
    return this.http.post<Conversion>(`${whiteRabbitApiUrl}/scan-report/db`, dbSettings)
  }

  generateScanReportByFiles(fileSettings: FilesSettings): Observable<Conversion> {
    const formData = new FormData();
    formData.append('settings', JSON.stringify({
      fileType: fileSettings.fileType,
      delimiter: fileSettings.delimiter,
      scanDataParams: fileSettings.scanDataParams
    }))
    fileSettings.files.forEach(file => formData.append('files', file))

    return this.http.post<Conversion>(`${whiteRabbitApiUrl}/scan-report/files`, formData)
  }

  conversionInfo(conversionId: number): Observable<Conversion> {
    return this.http.get<Conversion>(`${whiteRabbitApiUrl}/scan-report/conversion/${conversionId}`)
  }

  logs(conversionId: number): Observable<ProgressLog[]> {
    return this.http.get<ProgressLog[]>(`${whiteRabbitApiUrl}/scan-report/logs/${conversionId}`)
  }

  abort(conversionId: number): Observable<void> {
    return this.http.get<void>(`${whiteRabbitApiUrl}/scan-report/abort/${conversionId}`)
  }

  downloadScanReport(conversionId: number): Observable<Blob> {
    return this.http.get<Blob>(`${whiteRabbitApiUrl}/scan-report/result/${conversionId}`, {
      responseType: 'blob' as 'json'
    })
  }
}
