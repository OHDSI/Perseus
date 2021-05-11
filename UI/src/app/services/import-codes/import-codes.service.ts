import { Injectable } from '@angular/core';
import { Column } from '../../models/grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.constants';
import { stateCodeMappings, stateCodes, stateColumns } from './state';
import { SourceConcept } from '../../models/code-mapping/source-concept';
import { CodeMapping } from '../../models/code-mapping/code-mapping';
import { CodeMappingParams } from '../../models/code-mapping/code-mapping-params';

@Injectable()
export class ImportCodesService {

  csv: File

  codes: SourceConcept[]

  columns: Column[]

  codeMappings: CodeMapping[]

  private sourceNameColumn: string

  constructor(private httpClient: HttpClient) {
    this.codes = stateCodes
    this.columns = stateColumns
    this.codeMappings = stateCodeMappings
  }

  get imported(): boolean {
    return !!this.codes && !!this.columns
  }

  loadCsv(csv: File, delimeter = ','): Observable<SourceConcept[]> {
    const formData = new FormData()
    formData.append('file', csv)
    formData.append('delimiter', delimeter)

    return this.httpClient.post<SourceConcept[]>(`${apiUrl}/load_codes_to_server`, formData)
      .pipe(
        tap(codes => {
          if (codes.length === 0) {
            throw new Error('Empty csv file')
          }
          this.codes = codes
          this.columns = Object.keys(codes[0]).map(key => ({
            field: key,
            name: key
          }))
        })
      )
  }

  calculateScore(params: CodeMappingParams): Observable<CodeMapping[]> {
    const body = {
      params,
      codes: this.codes
    }
    return this.httpClient.post<CodeMapping[]>(`${apiUrl}/import_source_codes`, params)
      .pipe(
        tap(codeMappings => {
          this.sourceNameColumn = params.sourceName
          this.codeMappings = codeMappings
        })
      )
  }

  saveCodes(name): Observable<void> {
    const body = {
      name,
      codes: this.codeMappings.filter(codeMapping => codeMapping.selected)
    }
    return this.httpClient.post<void>(`${apiUrl}/save_codes`, body)
  }

  reset() {
    this.csv = null
    this.codes = null
    this.columns = null
    this.codeMappings = null
  }
}
