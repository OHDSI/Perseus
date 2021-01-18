import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Mapping } from '../models/mapping';

// use for dev purposes
// import * as schemaData from '../mockups/schema.mockup.json';

const {url: URL} = environment;
const API_URLS = {
  getCDMVersions: () => `${URL}/get_cdm_versions`,
  getTargetData: (version) => `${URL}/get_cdm_schema?cdm_version=${version}`,
  getSourceSchema: (path) => `${URL}/get_source_schema?path=${path}`,
  getSourceSchemaData: (name) => `${URL}/load_saved_source_schema?schema_name=${name}`,
  getColumnInfo: (tableName, columnName) => `${URL}/get_column_info?table_name=${tableName}&column_name=${columnName}`,
  getXmlPreview: () => `${URL}/get_xml`,
  getSqlPreview: (name) => `${URL}/get_generated_sql?source_table_name=${name}`,
  postLoadSchema: () => `${URL}/load_schema`,
  postSaveLoadSchema: () => `${URL}/save_and_load_schema`,
  getLookupsList: () => `${URL}/get_lookups_list`,
  getLookup: () => `${URL}/get_lookup`,
  saveLookup: () => `${URL}/save_lookup`,
  deleteLookup: () => `${URL}/delete_lookup`,
  saveSourceSchemaToDb: () => `${URL}/save_source_schema_to_db`,
  getView: () => `${URL}/get_view`,
  validateSql: () => `${URL}/validate_sql`

};

@Injectable({
  providedIn: 'root'
})
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

  getColumnInfo(tableName: string, columnName: string): Observable<any> {
    return this.httpClient.get<any>(API_URLS.getColumnInfo(tableName, columnName));
  }

  getXmlPreview(mapping: Mapping): Observable<any> {
    return this.httpClient.post(API_URLS.getXmlPreview(), mapping);
  }

  getSqlPreview(name: string): Observable<any> {
    return this.httpClient.get(API_URLS.getSqlPreview(name));
  }

  postLoadSchema(formData: FormData) {
    return this.httpClient.post(API_URLS.postLoadSchema(), formData);
  }

  postSaveLoadSchema(formData: FormData) {
    return this.httpClient.post(API_URLS.postSaveLoadSchema(), formData);

    // use this for dev purposes to use mockup for schemaData (to speed up)
    // return of(schemaData.data);
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
}
