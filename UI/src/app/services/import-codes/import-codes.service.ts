import { Injectable } from '@angular/core';
import { Column } from '../../models/grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.constants';
import { SourceCode } from '../../models/code-mapping/source-code';
import { CodeMapping } from '../../models/code-mapping/code-mapping';
import { CodeMappingParams } from '../../models/code-mapping/code-mapping-params';
import { Code } from '../../models/code-mapping/code';

@Injectable()
export class ImportCodesService {

  csv: File

  codes: Code[]

  columns: Column[]

  codeMappings: CodeMapping[]

  private sourceNameColumn: string

  constructor(private httpClient: HttpClient) {
  }

  get imported(): boolean {
    return !!this.codes && !!this.columns
  }

  loadCsv(csv: File, delimiter = ','): Observable<SourceCode[]> {
    const formData = new FormData()
    formData.append('file', csv)
    formData.append('delimiter', delimiter)

    return this.httpClient.post<SourceCode[]>(`${apiUrl}/load_codes_to_server`, formData)
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
    return this.httpClient.post<CodeMapping[]>(`${apiUrl}/import_source_codes`, body)
      .pipe(
        map(mappings => {
          mappings.forEach(mapping => mapping.selected = false)
          return mappings
        }),
        tap(codeMappings => {
          this.sourceNameColumn = params.sourceName
          this.codeMappings = codeMappings
        })
      )
  }

  saveCodes(name): Observable<void> {
    const body = {
      name,
      codes: this.codes,
      mappedCodes: this.codeMappings
        .filter(codeMapping => codeMapping.selected)
        .map(codeMapping => codeMapping.targetConcept.concept)
    }
    return this.httpClient.post<void>(`${apiUrl}/save_mapped_codes`, body)
  }

  reset() {
    this.csv = null
    this.codes = null
    this.columns = null
    this.codeMappings = null
  }
}
