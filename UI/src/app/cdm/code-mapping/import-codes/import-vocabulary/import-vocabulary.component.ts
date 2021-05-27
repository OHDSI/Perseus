import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { ImportVocabulariesService } from '../../../../services/import-codes/import-vocabularies.service';
import { openErrorDialog, parseHttpError } from '../../../../utilites/error';
import { MatDialog } from '@angular/material/dialog';
import { SetDelimiterDialogComponent } from '../../../../shared/set-delimiter-dialog/set-delimiter-dialog.component';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { codesRouter, mainPageRouter } from '../../../../app.constants';
import { CodeMappingDialogComponent } from '../../../../scan-data/code-mapping-dialog/code-mapping-dialog.component';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ImportCodesMediatorService } from '../../../../services/import-codes/import-codes-mediator.service';
import { columnsFromSourceCode } from '../../../../models/code-mapping/import-codes-state';
import { withLoading$ } from '../../../../utilites/loading';

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
        vocabularies => this.vocabularies = vocabularies,
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
          switchMap(delimiter => delimiter ? withLoading$(this, this.importCodesService.loadCsv(csv, delimiter)) : EMPTY),
        )
        .subscribe(
          () => this.import.emit(),
          error => openErrorDialog(this.dialogService, 'Failed to load CSV', parseHttpError(error))
        )
    }
  }

  onEdit(index: number) {
    const vocabulary = this.vocabularies[index]
    this.importCodesMediatorService.onWebsocketConnect$ = this.importVocabulariesService.prepareVocabulary(vocabulary)

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
            columns: columnsFromSourceCode(state.codes[0])
          })
          this.router.navigateByUrl(`${mainPageRouter + codesRouter}/mapping`)
        },
        error => openErrorDialog(this.dialogService, 'Failed to open Vocabulary', parseHttpError(error))
      )
  }

  onRemove(index: number) {
    const vocabulary = this.vocabularies[index]
    withLoading$(this, this.importVocabulariesService.remove(vocabulary))
      .subscribe(
        () => this.vocabularies = this.vocabularies.filter(vocab => vocab !== vocabulary),
        error => openErrorDialog(this.dialogService, 'Failed to remove Vocabulary', parseHttpError(error))
      )
  }
}
