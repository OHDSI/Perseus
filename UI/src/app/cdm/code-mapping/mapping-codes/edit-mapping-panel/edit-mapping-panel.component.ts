import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScoredConcept } from '../../../../models/code-mapping/scored-concept';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { parseHttpError } from '../../../../utilites/error';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { Concept } from '../../../../models/code-mapping/concept';
import { SearchMode } from '../../../../models/code-mapping/search-mode';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

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

  get filters() {
    return this.form.value
  }

  ngOnInit(): void {
    this.initForm()

    this.subscribeOnEditMapping()
  }

  onApply() {
    const concepts = this.scoredConcepts
      .filter(c => c.selected)
      .map(c => c.concept)
    this.apply.emit(concepts)
  }

  private subscribeOnEditMapping() {
    // Subscribe on click edit mapping in parent component
    this.codeMapping$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(codeMapping => {
        const term = codeMapping.sourceCode.code[this.importCodesService.sourceNameColumn]
        const selectedConcepts = codeMapping.targetConcepts.map(targetConcept => targetConcept.concept)
        this.initScoredConceptWithSelectedStream(term, selectedConcepts)
        this.form.reset()
      })
  }

  private initForm() {
    this.form = new FormGroup({
      searchString: new FormControl(null),
      searchMode: new FormControl(SearchMode.SEARCH_TERM_AS_QUERY),
      filterByUserSelectedConceptsAtcCode: new FormControl(false),
      filterStandardConcepts: new FormControl(false),
      includeSourceTerms: new FormControl(false),
      filterByConceptClass: new FormControl(false),
      filterByVocabulary: new FormControl(false),
      filterByDomain: new FormControl(false),
      conceptClasses: new FormControl([]),
      vocabularies: new FormControl([]),
      domains: new FormControl([])
    })

    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => this.loading = true),
        switchMap(value => this.scoredConceptWithSelected$(value))
      )
      .subscribe(scoredConcepts => {
        this.scoredConcepts = scoredConcepts
        this.loading = false
      }, error => {
        this.error = parseHttpError(error)
        this.loading = false
      })
  }

  private initScoredConceptWithSelectedStream(term: string, selectedConcepts: Concept[]) {
    this.scoredConceptWithSelected$ = (filters) =>
      this.importCodesService.getSearchResultByTerm(term, filters)
        .pipe(
          map(scoredConcepts => scoredConcepts.map(scoredConcept =>
            selectedConcepts.find(concept => concept.conceptId === scoredConcept.concept.conceptId)
              ? {...scoredConcept, selected: true}
              : scoredConcept
          ))
        )
  }
}
