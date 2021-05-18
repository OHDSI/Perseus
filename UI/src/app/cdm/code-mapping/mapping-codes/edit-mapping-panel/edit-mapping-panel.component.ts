import { Component, Input, OnInit } from '@angular/core';
import { ScoredConcept } from '../../../../models/code-mapping/scored-concept';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Component({
  selector: 'app-edit-mapping-panel',
  templateUrl: './edit-mapping-panel.component.html',
  styleUrls: ['./edit-mapping-panel.component.scss']
})
export class EditMappingPanelComponent extends BaseComponent implements OnInit {

  term$ = new ReplaySubject<string>(1)

  scoredConcepts: ScoredConcept[] = []

  constructor(private importCodesService: ImportCodesService) {
    super()
  }

  @Input()
  set term(term: string) {
    this.term$.next(term)
  }

  ngOnInit(): void {
    this.term$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(term => this.importCodesService.getSearchResultByTerm(term))
      )
      .subscribe(scoredConcepts => this.scoredConcepts = scoredConcepts)
  }

}
