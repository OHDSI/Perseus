import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mapping } from '../models/mapping';
import { map } from 'rxjs/operators';
import { apiUrl } from '../app.constants';
import { createNoCacheHeaders } from '../utilites/http-headers';

// use for dev purposes
// import-vocabulary * as schemaData from '../mockups/schema.mockup.json';

const URL = apiUrl;
const API_URLS = {
  getCDMVersions: () => `${URL}/get_cdm_versions`,
  getTargetData: (version) => `${URL}/get_cdm_schema?cdm_version=${version}`,
  getSourceSchema: (path) => `${URL}/get_source_schema?path=${path}`,
  getSourceSchemaData: (name) => `${URL}/load_saved_source_schema?schema_name=${name}`,
  getColumnInfo: (reportName, tableName, columnName) => `${URL}/get_column_info?report_name=${reportName}&table_name=${tableName}&column_name=${columnName}`,
  getXmlPreview: () => `${URL}/get_xml`,
  getZipXml: () => `${URL}/get_zip_xml`,
  getSqlPreview: (name) => `${URL}/get_generated_sql?source_table_name=${name}`,
  postLoadSchema: () => `${URL}/load_schema`,
  postSaveLoadSchema: () => `${URL}/save_and_load_schema`,
  getLookupsList: () => `${URL}/get_lookups_list`,
  getLookup: () => `${URL}/get_lookup`,
  saveLookup: () => `${URL}/save_lookup`,
  deleteLookup: () => `${URL}/delete_lookup`,
  saveSourceSchemaToDb: () => `${URL}/save_source_schema_to_db`,
  getView: () => `${URL}/get_view`,
  validateSql: () => `${URL}/validate_sql`,
  loadReportToServer: () => `${URL}/load_schema_to_server`
};

@Injectable()
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  getCDMVersions(): Observable<string[]> {
    return this.httpClient.get<string[]>(API_URLS.getCDMVersions());
  }

  getTargetData(version: string): Observable<any> {
    return this.httpClient.get<any>(API_URLS.getTargetData(version));
  }

  getSourceSchema(path: string): Observable<any> {
    return this.httpClient.get<any>(API_URLS.getSourceSchema(path));
  }

  getSourceSchemaData(name: string) {
    return this.httpClient.get<any>(API_URLS.getSourceSchemaData(name));
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

  getSqlPreview(name: string): Observable<any> {
    return this.httpClient.get(API_URLS.getSqlPreview(name));
  }

  postSaveLoadSchema(formData: FormData) {
    return this.httpClient.post(API_URLS.postSaveLoadSchema(), formData);
  }

  getLookupsList(lookupType) {
    return this.httpClient.get<any>(API_URLS.getLookupsList(), { params: { lookupType } });
  }

  getLookup(name, lookupType) {
    return this.httpClient.get<any>(API_URLS.getLookup(), { params: { name , lookupType} });
  }

  saveLookup(lookup) {
    return this.httpClient.post(API_URLS.saveLookup(), lookup);
  }

  deleteLookup(name, lookupType) {
    return this.httpClient.delete(API_URLS.deleteLookup(), { params: { name , lookupType } });
  }

  saveSourceSchemaToDb(sourceTables: any) {
    return this.httpClient.post(API_URLS.saveSourceSchemaToDb(), sourceTables);
  }

  getView(sql: any): Observable<any> {
    return this.httpClient.post(API_URLS.getView(), sql);
  }

  validateSql(sql: any): Observable<any> {
    return this.httpClient.post(API_URLS.validateSql(), sql);
  }

  loadReportToServer(file: any) {
    return this.httpClient.post(API_URLS.loadReportToServer(), file);
  }
}
