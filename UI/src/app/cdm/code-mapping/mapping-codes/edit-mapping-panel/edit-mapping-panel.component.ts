import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScoredConcept } from '../../../../models/code-mapping/scored-concept';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { catchErrorAndContinue, parseHttpError } from '../../../../utilites/error';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { Concept } from '../../../../models/code-mapping/concept';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Filter } from '../../../../models/filter/filter';
import {
  getDefaultSearchConceptFilters,
  mapFormFiltersToBackEndFilters,
  SearchConceptFilters
} from '../../../../models/code-mapping/search-concept-filters';
import { createFiltersForm, fillFilters, getFilters } from '../../../../models/code-mapping/filters';
import { SearchMode } from '../../../../models/code-mapping/search-mode';

@Component({
  selector: 'app-edit-mapping-panel',
  templateUrl: './edit-mapping-panel.component.html',
  styleUrls: ['./edit-mapping-panel.component.scss']
})
export class EditMappingPanelComponent extends BaseComponent implements OnInit {

  codeMapping$ = new ReplaySubject<CodeMapping>(1)

  scoredConcepts: ScoredConcept[] = []

  loading: boolean;

  error: string

  @Output()
  apply = new EventEmitter<Concept[]>()

  @Output()
  close = new EventEmitter<void>()

  form: FormGroup

  dropdownFilters: Filter[] = getFilters()

  searchMode = SearchMode.SEARCH_TERM_AS_QUERY

  // Map term with selected concepts to all concept list stream
  private scoredConceptWithSelected$: (filters) => Observable<ScoredConcept[]>

  constructor(private importCodesService: ImportCodesService) {
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

  get searchConceptFilters(): SearchConceptFilters {
    return {
      ...mapFormFiltersToBackEndFilters(this.form.value),
      searchMode: this.searchMode
    }
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
    const concepts = this.scoredConcepts
      .filter(c => c.selected)
      .map(c => c.concept)
    this.apply.emit(concepts)
  }

  onSearchModeChange(value: SearchMode) {
    this.searchMode = value
    const searchString = this.form.get('searchString')
    if (this.searchInputDisabled) {
      searchString.disable({emitEvent: false})
    } else {
      searchString.enable({emitEvent: false})
    }
  }

  /**
   * Subscribe on click edit mapping in parent component
   */
  private subscribeOnEditMapping() {
    this.codeMapping$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(codeMapping => {
        const term = codeMapping.sourceCode.code[this.importCodesService.sourceNameColumn]
        const selectedConcepts = codeMapping.targetConcepts.map(targetConcept => targetConcept.concept)
        const sourceAutoAssignedConceptIds = codeMapping.sourceCode.source_auto_assigned_concept_ids

        // Update server fetch request params for new code-MAPPING
        this.initScoredConceptWithSelectedStream(term, selectedConcepts, sourceAutoAssignedConceptIds)

        // Emit form value change to fetch data from server
        this.form.reset(getDefaultSearchConceptFilters())
      })
  }

  private initForm() {
    this.form = createFiltersForm()
    this.form.addControl('searchString', new FormControl({value: null, disabled: this.searchInputDisabled}))

    const handleError = error => this.error = parseHttpError(error)

    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => this.loading = true),
        switchMap(() => catchErrorAndContinue(
          this.scoredConceptWithSelected$(this.searchConceptFilters), handleError, []
        ))
      )
      .subscribe(scoredConcepts => {
        this.scoredConcepts = scoredConcepts
        this.loading = false
      })
  }

  private initScoredConceptWithSelectedStream(term: string,
                                              selectedConcepts: Concept[],
                                              sourceAutoAssignedConceptIds: number[]) {
    const toScoredConceptWithSelection = scoredConcepts => scoredConcepts.map(
      scoredConcept => selectedConcepts.find(concept => concept.conceptId === scoredConcept.concept.conceptId)
        ? {...scoredConcept, selected: true}
        : scoredConcept
    )

    this.scoredConceptWithSelected$ = (filters) => this.importCodesService.getSearchResultByTerm(term, filters, sourceAutoAssignedConceptIds)
      .pipe(
        map(toScoredConceptWithSelection)
      )
  }

  private initFilters() {
    fillFilters(this.dropdownFilters, this.importCodesService)
  }
}
