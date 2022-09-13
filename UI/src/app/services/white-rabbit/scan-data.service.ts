import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WrConnectionResult } from '@models/white-rabbit/connection-result';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { HttpClient } from '@angular/common/http';
import { whiteRabbitApiUrl } from '@app/app.constants';
import { FilesSettings } from '@models/white-rabbit/files-settings';
import { Conversion } from '@models/conversion/conversion'
import { ScanReportRequest } from '@models/perseus/scan-report-request'

@Injectable()
export class ScanDataService {

  constructor(private http: HttpClient) {
  }

  testConnection(dbSettings: DbSettings): Observable<WrConnectionResult> {
    return this.http.post<WrConnectionResult>(`${whiteRabbitApiUrl}/test-connection`, dbSettings);
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

  conversionInfoWithLogs(conversionId: number): Observable<Conversion> {
    return this.http.get<Conversion>(`${whiteRabbitApiUrl}/scan-report/conversion/${conversionId}`)
  }

  abort(conversionId: number): Observable<void> {
    return this.http.get<void>(`${whiteRabbitApiUrl}/scan-report/abort/${conversionId}`)
  }

  result(conversionId: number): Observable<ScanReportRequest> {
    return this.http.get<ScanReportRequest>(`${whiteRabbitApiUrl}/scan-report/result/${conversionId}`)
  }

  downloadScanReport(conversionId: number): Observable<Blob> {
    return this.http.get<Blob>(`${whiteRabbitApiUrl}/scan-report/result-as-resource/${conversionId}`, {
      responseType: 'blob' as 'json'
    })
  }
}
