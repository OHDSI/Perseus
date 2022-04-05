import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mapping } from '@models/mapping';
import { map } from 'rxjs/operators';
import { createNoCacheHeaders } from '@utils/http-headers';
import { perseusApiUrl } from '@app/app.constants'
import { ITable } from '@models/table'
import { ScanReport } from '@models/scan-report/scan-report'

// use for dev purposes
// import-vocabulary * as schemaData from '../mockups/schema.mockup.json';

const URL = perseusApiUrl;
const API_URLS = {
  getCDMVersions: () => `${URL}/get_cdm_versions`,
  getTargetData: (version) => `${URL}/get_cdm_schema?cdm_version=${version}`,
  getColumnInfo: (reportName, tableName, columnName) => `${URL}/get_column_info?report_name=${reportName}&table_name=${tableName}&column_name=${columnName}`,
  getXmlPreview: () => `${URL}/get_xml`,
  getZipXml: () => `${URL}/get_zip_xml`,
  saveSourceSchemaToDb: () => `${URL}/save_source_schema_to_db`,
  getView: () => `${URL}/get_view`,
  validateSql: () => `${URL}/validate_sql`
};

@Injectable()
export class PerseusApiService {

  constructor(private httpClient: HttpClient) {
  }

  uploadScanReport(scanReportFile: File): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('scanReportFile', scanReportFile, scanReportFile.name);
    return this.httpClient.post<void>(`${perseusApiUrl}/upload_scan_report`, formData);
  }

  /**
   * @return source tables list
   */
  uploadScanReportAndCreateSourceSchema(scanReportFile: File): Observable<any[]> {
    const formData: FormData = new FormData();
    formData.append('scanReportFile', scanReportFile, scanReportFile.name);
    return this.httpClient.post<any[]>(`${perseusApiUrl}/upload_scan_report_and_create_source_schema`, formData);
  }

  /**
   * @return source tables list
   */
  createSourceSchemaByScanReport(scanReport: ScanReport): Observable<any> {
    return this.httpClient.post<any[]>(`${perseusApiUrl}/create_source_schema_by_scan_report`, scanReport);
  }

  createSourceSchema(sourceTables: ITable[]): Observable<string> {
    return this.httpClient.post<string>(`${perseusApiUrl}/create_source_schema`, sourceTables);
  }

  getCDMVersions(): Observable<string[]> {
    return this.httpClient.get<string[]>(API_URLS.getCDMVersions());
  }

  getTargetData(version: string): Observable<any> {
    return this.httpClient.get<any>(API_URLS.getTargetData(version));
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
