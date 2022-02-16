import { Injectable } from '@angular/core';
import { Column } from '@models/grid/grid';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CodeMapping } from '@models/code-mapping/code-mapping';
import { CodeMappingParams } from '@models/code-mapping/code-mapping-params';
import { Code } from '@models/code-mapping/code';
import { ScoredConcept } from '@models/code-mapping/scored-concept';
import { columnsFromSourceCode, ImportCodesState } from '@models/code-mapping/import-codes-state';
import { FilterValue } from '@models/filter/filter';
import { defaultSearchConceptFilters, SearchConceptFilters } from '@models/code-mapping/search-concept-filters';
import { StateService } from '@services/state/state.service';
import { usagiUrl } from '@app/app.constants'

const initialState: ImportCodesState = {
  codes: null,
  columns: null,
  mappingParams: null,
  codeMappings: null,
  filters: defaultSearchConceptFilters(),
  isExisted: false
}

@Injectable()
export class ImportCodesService implements StateService {

  private state: ImportCodesState

  constructor(private httpClient: HttpClient) {
    this.state = {...initialState}
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

  get filters(): SearchConceptFilters {
    return this.state.filters
  }

  set filters(filters: SearchConceptFilters) {
    this.state.filters = filters
  }

  get isExisted() {
    return this.state.isExisted
  }

  get vocabularyName() {
    return this.state.vocabularyName
  }

  /**
   * Parse CSV file to json array on server
   */
  loadCsv(csv: File, delimiter = ','): Observable<Code[]> {
    const formData = new FormData()
    formData.append('file', csv)
    formData.append('delimiter', delimiter)

    return this.httpClient.post<Code[]>(`${usagiUrl}/load_codes_to_server`, formData)
      .pipe(
        tap(codes => {
          if (codes.length === 0) {
            throw new Error('Empty csv file')
          }
          this.state.codes = codes
          this.state.columns = columnsFromSourceCode(codes[0])
        })
      )
  }

  calculateScore(): Observable<void> {
    const body = {
      params: this.mappingParams,
      codes: this.codes,
      filters: this.filters
    }
    return this.httpClient.post<void>(`${usagiUrl}/import_source_codes`, body)
  }

  getCodesMappings(): Observable<CodeMapping[]> {
    return this.httpClient.get<CodeMapping[]>(`${usagiUrl}/get_import_source_codes_results`)
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
    const body = {term, sourceAutoAssignedConceptIds, filters}
    return this.httpClient.post<ScoredConcept[]>(`${usagiUrl}/get_term_search_results`, body)
  }

  saveCodes(name): Observable<void> {
    const body = {
      name,
      codes: this.codes,
      mappingParams: this.mappingParams,
      codeMappings: this.codeMappings,
      filters: this.filters
    }
    return this.httpClient.post<void>(`${usagiUrl}/save_mapped_codes`, body)
  }

  /**
   * Concepts classes, Vocabularies, Domains filters
   */
  fetchFilters(): Observable<{[key: string]: FilterValue[]}> {
    return this.httpClient.get<{[key: string]: string[]}>(`${usagiUrl}/get_filters`)
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

  reset(state?: ImportCodesState) {
    this.state = state ? {...state} : {...initialState};
  }

  cancelCalculateScoresByCsvCodes(): Observable<void> {
    return this.httpClient.get<void>(`${usagiUrl}/cancel_concept_mapping_task`)
  }

  cancelCalculateScoresBySavedMapping(): Observable<void> {
    return this.httpClient.get<void>(`${usagiUrl}/cancel_load_vocabulary_task`)
  }
}
