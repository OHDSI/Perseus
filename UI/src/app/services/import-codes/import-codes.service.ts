import { Injectable } from '@angular/core';
import { Column } from '../../models/grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.constants';
import { SourceCode } from '../../models/code-mapping/source-code';
import { CodeMapping } from '../../models/code-mapping/code-mapping';
import { CodeMappingParams } from '../../models/code-mapping/code-mapping-params';
import { Code } from '../../models/code-mapping/code';
import * as state from './state'
import { ScoredConcept } from '../../models/code-mapping/scored-concept';
import { ImportCodesState } from '../../models/code-mapping/import-codes-state';

const initialState: ImportCodesState = {
  codes: null,
  columns: null,
  mappingParams: null,
  codeMappings: null,
  sourceNameColumn: null,
  scoredConcepts: null
}

@Injectable()
export class ImportCodesService {

  private state: ImportCodesState

  constructor(private httpClient: HttpClient) {
    this.state = {
      ...initialState,
      codes: state.stateCodes, columns:
      state.stateColumns,
      codeMappings: state.stateCodeMappings,
      sourceNameColumn: state.sourceNameColumn
    }
  }

  get codes(): Code[] {
    return this.state.codes
  }

  get columns(): Column[] {
    return this.state.columns
  }

  get mappingParams(): CodeMappingParams {
    return this.state.mappingParams
  }

  get codeMappings(): CodeMapping[] {
    return this.state.codeMappings
  }

  set codeMappings(codeMapping: CodeMapping[]) {
    this.state.codeMappings = codeMapping
  }

  get sourceNameColumn(): string {
    return this.state.sourceNameColumn
  }

  set vocabulary(vocabulary: ImportCodesState) {
    this.state = {...vocabulary}
  }

  get imported(): boolean {
    return !!this.codes && !!this.columns
  }

  /**
   * Parse CSV file to json array on server
   */
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
          this.state.codes = codes
          this.state.columns = Object.keys(codes[0]).map(key => ({
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
        tap(codeMappings => {
          codeMappings.forEach(item => item.approved = false)
          this.state.sourceNameColumn = params.sourceName
          this.state.codeMappings = codeMappings
          this.state.mappingParams = params
        })
      )
  }

  /**
   * Get all mappings for concrete term, sorted by match score
   * @param term - source name column
   */
  getSearchResultByTerm(term: string): Observable<ScoredConcept[]> {
    return this.httpClient.get<ScoredConcept[]>(`${apiUrl}/get_term_search_results?term=${term}`)
  }

  saveCodes(name): Observable<void> {
    const body = {
      name,
      codes: this.codes,
      mappingParams: this.mappingParams,
      codeMappings: this.codeMappings
    }
    return this.httpClient.post<void>(`${apiUrl}/save_mapped_codes`, body)
  }

  reset() {
    this.state = {...initialState}
  }
}
