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

  searchString: string
  mode = SearchMode.SEARCH_TERM_AS_QUERY

  private searchStrategies = {
    [SearchMode.SEARCH_TERM_AS_QUERY]: (concept: ScoredConcept, searchString: string) =>
      concept.term.toLowerCase().includes(searchString.toLowerCase()),

    [SearchMode.QUERY]: (concept: ScoredConcept, searchString: string) =>
      concept.concept.conceptName.toLowerCase().includes(searchString.toLowerCase())
  }

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

  ngOnInit(): void {
    // Map term with selected concepts to all concept list stream
    const allScoredConceptWithSelected$ = (term: string, selectedConcepts: Concept[]) =>
      this.importCodesService.getSearchResultByTerm(term)
        .pipe(
          map(scoredConcepts => scoredConcepts.map(scoredConcept =>
            selectedConcepts.find(concept => concept.conceptId === scoredConcept.concept.conceptId)
              ? {...scoredConcept, selected: true}
              : scoredConcept
          ))
        )

    const termColumn = this.importCodesService.sourceNameColumn

    // Subscribe on click edit mapping in parent component
    this.codeMapping$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => this.loading = true),
        switchMap(codeMapping => allScoredConceptWithSelected$(
          codeMapping.sourceCode.code[termColumn],
          codeMapping.targetConcepts.map(targetConcept => targetConcept.concept)
        )),
      )
      .subscribe(scoredConcepts => {
        this.scoredConcepts = scoredConcepts
        this.loading = false
      }, error => {
        this.error = parseHttpError(error)
        this.loading = false
      })
  }

  onApply() {
    const concepts = this.scoredConcepts
      .filter(c => c.selected)
      .map(c => c.concept)
    this.apply.emit(concepts)
  }

  onSearch(value: string) {
    this.searchString = value
    this.scoredConcepts = this.scoredConcepts
      .filter(concept => this.searchStrategies[this.mode](concept, value))
  }
}
