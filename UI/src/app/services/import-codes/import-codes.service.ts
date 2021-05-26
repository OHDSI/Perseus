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
import { ScoredConcept } from '../../models/code-mapping/scored-concept';
import { ImportCodesState } from '../../models/code-mapping/import-codes-state';
import { ScoredConceptsCacheService } from './scored-concepts-cache.service';
import { of } from 'rxjs';
import { FilterValue } from '../../models/filter/filter';
import { SearchConceptFilters } from '../../models/code-mapping/search-concept-filters';

const initialState: ImportCodesState = {
  codes: null,
  columns: null,
  mappingParams: null,
  codeMappings: null
}

@Injectable()
export class ImportCodesService {

  private state: ImportCodesState

  constructor(private httpClient: HttpClient,
              private scoredConceptCacheService: ScoredConceptsCacheService) {
    const stateFromStorage = JSON.parse(localStorage.getItem('code-mappings'))
    this.state = {...initialState, ...stateFromStorage}
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

  set mappingParams(mappingParams: CodeMappingParams) {
    this.state.mappingParams = mappingParams
  }

  get codeMappings(): CodeMapping[] {
    return this.state.codeMappings
  }

  set codeMappings(codeMapping: CodeMapping[]) {
    this.state.codeMappings = codeMapping
  }

  get sourceNameColumn(): string {
    return this.state.mappingParams?.sourceName
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

  calculateScore(): Observable<void> {
    const body = {
      params: this.mappingParams,
      codes: this.codes
    }
    return this.httpClient.post<void>(`${apiUrl}/import_source_codes`, body)
  }

  getCodesMappings(): Observable<CodeMapping[]> {
    return this.httpClient.get<CodeMapping[]>(`${apiUrl}/get_import_source_codes_results`)
      .pipe(
        tap(codeMappings => this.state.codeMappings = codeMappings)
      )
  }

  /**
   * Get all mappings for concrete term, sorted by match score
   * @param term - source name column
   * @param filters - filters for search
   * @param sourceAutoAssignedConceptIds - sourceConcept.sourceAutoAssignedConceptIds
   */
  getSearchResultByTerm(term: string, filters: SearchConceptFilters, sourceAutoAssignedConceptIds: number[]): Observable<ScoredConcept[]> {
    const fromCache = this.scoredConceptCacheService.get(term)
    if (fromCache) {
      return of(fromCache)
    }
    const body = {term, sourceAutoAssignedConceptIds, filters}
    return this.httpClient.post<ScoredConcept[]>(`${apiUrl}/get_term_search_results`, body)
      .pipe(
        tap(scoredConcepts => this.scoredConceptCacheService.add(term, scoredConcepts))
      )
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

  /**
   * Concepts classes, Vocabularies, Domains filters
   */
  filters(): Observable<{[key: string]: FilterValue[]}> {
    return this.httpClient.get<{[key: string]: string[]}>(`${apiUrl}/get_filters`)
      .pipe(
        map(res => {
          const parsed: {[key: string]: FilterValue[]} = {}
          Object.keys(res).forEach(key => parsed[key] = res[key].map(it => ({
            name: it,
            checked: false,
            disabled: false
          })))
          return parsed
        })
      )
  }

  saveToStorage() {
    localStorage.setItem('code-mappings', JSON.stringify(this.state))
  }
}
