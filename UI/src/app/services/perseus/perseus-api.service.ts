import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mapping } from '@models/mapping';
import { map } from 'rxjs/operators';
import { createNoCacheHeaders } from '@utils/http-headers';
import { perseusApiUrl } from '@app/app.constants'
import { ScanReportRequest } from '@models/perseus/scan-report-request'
import { UploadScanReportResponse } from '@models/perseus/upload-scan-report-response'
import { TableInfoResponse } from '@models/perseus/table-info-response'
import { UploadEtlMappingResponse } from '@models/perseus/upload-etl-mapping-response'
import { GenerateEtlArchiveRequest } from '@models/perseus/generate-etl-archive-request'

// use for dev purposes
// import-vocabulary * as schemaData from '../mockups/schema.mockup.json';

const URL = perseusApiUrl;
const API_URLS = {
  getColumnInfo: (reportName, tableName, columnName) => `${URL}/get_column_info?report_name=${reportName}&table_name=${tableName}&column_name=${columnName}`,
  getXmlPreview: () => `${URL}/get_xml`,
  getZipXml: () => `${URL}/get_zip_xml`,
  getView: () => `${URL}/get_view`,
  validateSql: () => `${URL}/validate_sql`
};

@Injectable()
export class PerseusApiService {

  constructor(private httpClient: HttpClient) {
  }

  uploadScanReport(scanReportFile: File): Observable<UploadScanReportResponse> {
    const formData: FormData = new FormData();
    formData.append('scanReportFile', scanReportFile, scanReportFile.name);
    return this.httpClient.post<UploadScanReportResponse>(`${perseusApiUrl}/upload_scan_report`, formData);
  }

  uploadEtlMapping(etlMappingArchiveFile: File): Observable<UploadEtlMappingResponse> {
    const formData: FormData = new FormData();
    formData.append('etlArchiveFile', etlMappingArchiveFile, etlMappingArchiveFile.name);
    return this.httpClient.post<UploadEtlMappingResponse>(`${perseusApiUrl}/upload_etl_mapping`, formData)
  }

  createSourceSchemaByScanReport(scanReport: ScanReportRequest): Observable<UploadScanReportResponse> {
    return this.httpClient.post<UploadScanReportResponse>(`${perseusApiUrl}/create_source_schema_by_scan_report`, scanReport);
  }

  generateEtlMappingArchive(request: GenerateEtlArchiveRequest): Observable<Blob> {
    const headers = createNoCacheHeaders()
    const url = `${perseusApiUrl}/generate_etl_mapping_archive`
    return this.httpClient.post(url, request, {headers, responseType: 'blob'})
  }

  getCDMVersions(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${perseusApiUrl}/get_cdm_versions`);
  }

  getTargetData(version: string): Observable<TableInfoResponse[]> {
    return this.httpClient.get<any>(`${perseusApiUrl}/get_cdm_schema?cdm_version=${version}`);
  }

  getColumnInfo(reportName: string, tableName: string, columnName: string): Observable<any> {
    return this.httpClient.get<any>(API_URLS.getColumnInfo(reportName, tableName, columnName));
  }

  getXmlPreview(mapping: Mapping): Observable<any> {
    return this.httpClient.post(API_URLS.getXmlPreview(), mapping);
  }

  getZipXml(name: string): Observable<File> {
    const headers = createNoCacheHeaders()
    return this.httpClient.get(API_URLS.getZipXml(), {headers, responseType: 'blob'})
      .pipe(
        map(blob => new File([blob], `${name}-xml.zip`))
      )
  }

  getView(sql: any): Observable<any> {
    return this.httpClient.post(API_URLS.getView(), sql);
  }

  validateSql(sql: any): Observable<any> {
    return this.httpClient.post(API_URLS.validateSql(), sql);
  }
}
