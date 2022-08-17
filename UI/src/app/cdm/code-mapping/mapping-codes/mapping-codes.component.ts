import { Component } from '@angular/core';
import { ImportCodesService } from '@services/usagi/import-codes.service';
import { Router } from '@angular/router';
import { codesRouter, mainPageRouter } from '@app/app.constants';
import { switchMap } from 'rxjs/operators';
import { openErrorDialog, parseHttpError } from '@utils/error';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { SaveVocabularyPopupComponent } from './save-vocabulary-popup/save-vocabulary-popup.component';
import { CodeMapping } from '@models/code-mapping/code-mapping';
import { Concept } from '@models/code-mapping/concept';
import { ScoredConceptsCacheService } from '@services/usagi/scored-concepts-cache.service';
import { withLoading } from '@utils/loading';
import { VocabularyObserverService } from '@services/athena/vocabulary-observer.service';
import { WarningPopupComponent } from '@popups/warning-popup/warning-popup.component';

@Component({
  selector: 'app-mapping-codes',
  templateUrl: './mapping-codes.component.html',
  styleUrls: ['./mapping-codes.component.scss']
})
export class MappingCodesComponent {

  loading = false

  editingMapping: CodeMapping

  constructor(private importCodesService: ImportCodesService,
              private router: Router,
              private dialogService: MatDialog,
              private conceptCacheService: ScoredConceptsCacheService,
              public vocabularyObserverService: VocabularyObserverService) {
  }

  get applyDisabled() {
    return this.importCodesService.codeMappings.every(codeMapping => !codeMapping.approved)
  }

  onBack() {
    this.dialogService.open(WarningPopupComponent, {
      data: {
        header: 'Reset mapped codes',
        message: 'Mapped codes will be lost'
      },
      disableClose: true,
      panelClass: 'perseus-dialog',
    }).afterClosed()
      .subscribe(res => {
        if (res) {
          this.importCodesService.codeMappings = null
          this.conceptCacheService.clear()
          this.router.navigateByUrl(mainPageRouter + codesRouter)
        }
      })
  }

  onSave() {
    this.dialogService.open(SaveVocabularyPopupComponent, {
      panelClass: 'perseus-dialog',
      disableClose: true
    }).afterClosed()
      .pipe(
        switchMap(name => name ? this.importCodesService.saveCodes(name).pipe(withLoading(this)) : EMPTY),
      )
      .subscribe(
        () => {
          this.importCodesService.reset()
          this.router.navigateByUrl(mainPageRouter + codesRouter)
        },
        error => openErrorDialog(this.dialogService, 'Failed to save Codes', parseHttpError(error))
      )
  }

  onEditMapping(mapping: CodeMapping) {
    this.editingMapping = mapping
  }

  onApplyEditedMapping(concepts: Concept[]) {
    if (concepts.length === 0) {
      this.editingMapping.targetConcepts = this.editingMapping.targetConcepts.slice(0, 1)
    } else {
      this.editingMapping.targetConcepts = concepts.map(concept => ({
        concept,
        term: [concept.term]
      }))
    }
    this.editingMapping = null // Close panel
  }

  onCancelEditingMapping() {
    this.editingMapping = null
  }
}
