import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImportCodesService } from '@services/usagi/import-codes.service';
import { ImportVocabulariesService } from '@services/usagi/import-vocabularies.service';
import { openErrorDialog, parseHttpError } from '@utils/error';
import { MatDialog } from '@angular/material/dialog';
import { SetDelimiterDialogComponent } from '@shared/set-delimiter-dialog/set-delimiter-dialog.component';
import { catchError, filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { codesRouter, mainPageRouter } from '@app/app.constants';
import { CodeMappingDialogComponent } from '@scan-data/code-mapping-dialog/code-mapping-dialog.component';
import { BaseComponent } from '@shared/base/base.component';
import { ImportCodesMediatorService } from '@services/usagi/import-codes-mediator.service';
import { columnsFromSourceCode } from '@models/code-mapping/import-codes-state';
import { withLoading } from '@utils/loading';
import { ConsoleHeader } from '@models/code-mapping/console-header';
import { RemoveVocabularyConfirmComponent } from '@code-mapping/import-codes/import-vocabulary/remove-vocabulary-confirm/remove-vocabulary-confirm.component';

@Component({
  selector: 'app-import-vocabulary',
  templateUrl: './import-vocabulary.component.html',
  styleUrls: [
    './import-vocabulary.component.scss',
    '../styles/column-mapping-panel.scss',
    '../styles/import-codes-wrapper.scss'
  ]
})
export class ImportVocabularyComponent extends BaseComponent implements OnInit {

  vocabularies: string[]

  visibleVocabCount = 3

  showOther = false;

  loading = false;

  @ViewChild('csvInput', {static: true})
  csvInput: ElementRef

  @Output()
  import = new EventEmitter<void>()

  constructor(private importCodesService: ImportCodesService,
              private importVocabulariesService: ImportVocabulariesService,
              private importCodesMediatorService: ImportCodesMediatorService,
              private dialogService: MatDialog,
              private router: Router) {
    super()
  }

  ngOnInit(): void {
    this.importVocabulariesService.all()
      .subscribe(
        vocabularies => this.vocabularies = [...vocabularies],
        error => openErrorDialog(this.dialogService, 'Failed to load vocabularies', parseHttpError(error)),
        () => !this.vocabularies && (this.vocabularies = [])
      )
  }

  onShowOther() {
    this.showOther = !this.showOther
  }

  onImport() {
    this.csvInput.nativeElement.click()
  }

  onFileUpload(event: Event) {
    const csv = (event.target as HTMLInputElement).files[0]

    if (csv) {
      this.dialogService.open(SetDelimiterDialogComponent, {
        panelClass: 'perseus-dialog',
        disableClose: true
      }).afterClosed()
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(() => this.loading = true),
          switchMap(delimiter => {
            if (delimiter) {
              return this.importCodesService.loadCsv(csv, delimiter)
            } else {
              this.csvInput.nativeElement.value = null
              return EMPTY
            }
          }),
          catchError(error => {
            openErrorDialog(this.dialogService, 'Failed to load CSV', parseHttpError(error))
            this.csvInput.nativeElement.value = null
            return EMPTY
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(
          () => this.import.emit()
        )
    }
  }

  onEdit(index: number) {
    const vocabularyName = this.vocabularies[index]
    this.importCodesMediatorService.consoleHeader = ConsoleHeader.LOAD_VOCABULARY
    this.importCodesMediatorService.onWebsocketConnect$ = this.importVocabulariesService.prepareVocabulary(vocabularyName)
    this.importCodesMediatorService.onAbort$ = this.importCodesService.cancelCalculateScoresBySavedMapping()

    this.dialogService
      .open(CodeMappingDialogComponent, { panelClass: 'scan-data-dialog', disableClose: true })
      .afterClosed()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(value => value),
        switchMap(() => this.importVocabulariesService.getVocabulary())
      )
      .subscribe(
        state => {
          this.importCodesService.reset({
            ...state,
            columns: columnsFromSourceCode(state.codes[0]),
            isExisted: true,
            vocabularyName
          })
          this.router.navigateByUrl(`${mainPageRouter + codesRouter}/mapping`)
        },
        error => openErrorDialog(this.dialogService, 'Failed to open Vocabulary', parseHttpError(error))
      )
  }

  onRemove(index: number) {
    const vocabulary = this.vocabularies[index]
    this.dialogService.open(RemoveVocabularyConfirmComponent, {
      panelClass: 'perseus-dialog',
      disableClose: true,
      data: vocabulary
    }).afterClosed()
      .pipe(
        switchMap(result => result
          ? this.importVocabulariesService.remove(vocabulary).pipe(withLoading(this))
          : EMPTY
        )
      )
      .subscribe(
        () => this.vocabularies = this.vocabularies.filter(vocab => vocab !== vocabulary),
        error => openErrorDialog(this.dialogService, 'Failed to remove Vocabulary', parseHttpError(error))
      )
  }
}
