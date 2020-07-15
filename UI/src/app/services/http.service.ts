import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Mapping } from '../models/mapping';

const {url: URL} = environment;
const API_URLS = {
  getCDMVersions: () => `${URL}/get_cdm_versions`,
  getTargetData: (version) => `${URL}/get_cdm_schema?cdm_version=${version}`,
  getSourceSchema: (path) => `${URL}/get_source_schema?path=${path}`,
  getSourceSchemaData: (name) => `${URL}/load_saved_source_schema?schema_name=${name}`,
  getTopValues: (tableName, columnName) => `${URL}/get_top_values?table_name=${tableName}&column_name=${columnName}`,
  getXmlPreview: () => `${URL}/get_xml`,
  getSqlPreview: (name) => `${URL}/get_generated_sql?source_table_name=${name}`,
  postLoadSchema: () => `${URL}/load_schema`,
  postSaveLoadSchema: () => `${URL}/save_and_load_schema`

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

  getTopValues(tableName: string, columnName: string): Observable<any> {
    return this.httpClient.get<any>(API_URLS.getTopValues(tableName, columnName));
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
  }

}
