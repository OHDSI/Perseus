import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ScoredConcept } from '../../../../models/code-mapping/scored-concept';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { catchError, filter, map, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { parseHttpError } from '../../../../utilites/error';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { Concept } from '../../../../models/code-mapping/concept';
import { FormControl, FormGroup } from '@angular/forms';
import { Filter } from '../../../../models/filter/filter';
import {
  defaultSearchConceptFilters,
  defaultSearchMode,
  mapFormFiltersToBackEndFilters,
  SearchConceptFilters
} from '../../../../models/code-mapping/search-concept-filters';
import { createFiltersForm, fillFilters, getFilters } from '../../../../models/code-mapping/filters';
import { SearchMode } from '../../../../models/code-mapping/search-mode';
import { isFormChanged, toScoredConceptWithSelection, toSearchByTermParams } from './edit-mapping-panel';
import { ScoredConceptsCacheService } from '../../../../services/import-codes/scored-concepts-cache.service';
import { of } from 'rxjs';
import { getTerm } from '../../../../utilites/code-mapping-util';
import { SearchByTermParams } from '../../../../models/code-mapping/search-by-term-params';

@Component({
  selector: 'app-edit-mapping-panel',
  templateUrl: './edit-mapping-panel.component.html',
  styleUrls: ['./edit-mapping-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMappingPanelComponent extends BaseComponent implements OnInit {

  codeMapping$ = new ReplaySubject<CodeMapping>(1)
  mapping: CodeMapping

  scoredConcepts: ScoredConcept[] = []

  loading: boolean;

  error: string

  @Output()
  apply = new EventEmitter<Concept[]>()

  @Output()
  close = new EventEmitter<void>()

  form: FormGroup

  dropdownFilters: Filter[] = getFilters()

  searchMode: SearchMode

  private firstEmit = true
  private needUpdate: boolean
  private skipUpdate: boolean

  private searchByTermParams: SearchByTermParams

  constructor(private importCodesService: ImportCodesService,
              private scoredConceptsCacheService: ScoredConceptsCacheService,
              private cdr: ChangeDetectorRef) {
    super()
  }

  @Input()
  set codeMapping(codeMapping: CodeMapping) {
    this.codeMapping$.next(codeMapping)
  }

  get applyActive() {
    return this.scoredConcepts.length && this.scoredConcepts.find(concept => concept.selected)
  }

  get applyDisabled() {
    return !this.applyActive
  }

  get searchInputDisabled() {
    return this.searchMode === SearchMode.SEARCH_TERM_AS_QUERY
  }

  ngOnInit(): void {
    this.initForm()

    this.initFilters()

    this.subscribeOnEditMapping()
  }

  onApply() {
    this.saveToCache(this.mapping)
    const concepts = this.scoredConcepts
      .filter(c => c.selected)
      .map(c => ({...c.concept, term: c.term[0]}))
    this.apply.emit(concepts)
  }

  onClose() {
    this.saveToCache(this.mapping)
    this.close.emit()
  }

  onSearchModeChange(value: SearchMode, resetSearchString = true) {
    this.searchMode = value
    const searchString = this.form.get('searchString')
    if (this.searchInputDisabled) {
      if (resetSearchString) {
        searchString.setValue(null)
      }
      searchString.disable({emitEvent: false})
    } else {
      searchString.enable({emitEvent: false})
    }
  }

  /**
   * Subscribe on click edit mapping in parent component
   */
  private subscribeOnEditMapping() {
    this.codeMapping$ // When user clicked edit concept
      .pipe(
        takeUntil(this.ngUnsubscribe),
        startWith<CodeMapping, CodeMapping>(null),
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        if (prev) {
          this.saveToCache(prev)
        }

        const term = getTerm(curr, this.importCodesService.sourceNameColumn)
        this.searchByTermParams = toSearchByTermParams(term, curr)
        this.mapping = curr

        const fromCache = this.scoredConceptsCacheService.get(term);

        if (this.firstEmit) {
          this.firstEmit = false
          this.subscribeOnFormChange(fromCache?.filters)
        }

        if (fromCache) {
          this.setCacheValueToForm(fromCache.filters)
          this.onSearchModeChange(fromCache.searchMode, false)
          this.scoredConcepts = fromCache.concepts
        } else {
          this.needUpdate = true
          const defaultFilters = defaultSearchConceptFilters()
          this.form.reset(defaultFilters, {onlySelf: true})
          this.onSearchModeChange(defaultSearchMode)
        }
      })
  }

  private initForm() {
    this.form = createFiltersForm()
    this.form.addControl('searchString', new FormControl({value: null, disabled: this.searchInputDisabled}))
  }

  private subscribeOnFormChange(startValue: SearchConceptFilters) {
    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        startWith<SearchConceptFilters, SearchConceptFilters>(startValue),
        pairwise(),
        filter(([prev, curr]) => this.isFormChanged(prev, curr)),
        map(([, curr]) => mapFormFiltersToBackEndFilters(curr, this.searchMode)),
        tap(() => this.loading = true),
        switchMap(filters => this.searchByTerm(filters)),
        map(scoredConcepts => this.toScoredConceptWithSelection(scoredConcepts))
      )
      .subscribe(scoredConcepts => {
        this.scoredConcepts = scoredConcepts
        this.loading = false
        this.cdr.detectChanges()
      })
  }

  private searchByTerm(filters) {
    const {term, sourceAutoAssignedConceptIds} = this.searchByTermParams
    return this.importCodesService.getSearchResultByTerm(term, filters, sourceAutoAssignedConceptIds)
      .pipe(
        catchError(error => {
          this.error = parseHttpError(error)
          return of([])
        })
      )
  }

  private initFilters() {
    fillFilters(this.dropdownFilters, this.importCodesService)
  }

  private saveToCache(mapping: CodeMapping) {
    const toCache = {
      concepts: [...this.scoredConcepts],
      filters: this.form.value,
      searchMode: this.searchMode
    }
    const term = getTerm(mapping, this.importCodesService.sourceNameColumn)
    this.scoredConceptsCacheService.add(term, toCache)
  }

  private isFormChanged(prev: SearchConceptFilters, curr: SearchConceptFilters): boolean {
    if (this.needUpdate) { // {emitEvent: false} doesn't work
      this.needUpdate = false
      return true
    } else if (this.skipUpdate) {
      return false
    } else {
      return isFormChanged(prev, curr)
    }
  }

  private toScoredConceptWithSelection(scoredConcepts: ScoredConcept[]) {
    const {selectedConcepts} = this.searchByTermParams
    return toScoredConceptWithSelection(scoredConcepts, selectedConcepts)
  }

  private setCacheValueToForm(fromCache: SearchConceptFilters) {
    this.skipUpdate = true
    Object.keys(this.form.controls)
      .forEach(key => this.form.get(key).setValue(fromCache[key], {emitEvent: false, onlySelf: true}))
    this.skipUpdate = false
  }
}
