import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { ImportVocabulariesService } from '../../../../services/import-codes/import-vocabularies.service';
import { openErrorDialog, parseHttpError } from '../../../../utilites/error';
import { MatDialog } from '@angular/material/dialog';
import { SetDelimiterDialogComponent } from '../../../../shared/set-delimiter-dialog/set-delimiter-dialog.component';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { codesRouter, mainPageRouter } from '../../../../app.constants';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-import-vocabulary',
  templateUrl: './import-vocabulary.component.html',
  styleUrls: [
    './import-vocabulary.component.scss',
    '../styles/column-mapping-panel.scss',
    '../styles/import-codes-wrapper.scss'
  ]
})
export class ImportVocabularyComponent implements OnInit {

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
              private dialogService: MatDialog,
              private router: Router) {
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
          tap(() => this.loading = true),
          switchMap(delimiter => delimiter ? this.importCodesService.loadCsv(csv) : EMPTY),
          finalize(() => this.loading = false)
        )
        .subscribe(
          () => this.import.emit(),
          error => openErrorDialog(this.dialogService, 'Failed to load CSV', parseHttpError(error))
        )
    }
  }

  onEdit(index: number) {
    const vocabulary = this.vocabularies[index]
    this.withLoading$(this.importVocabulariesService.get(vocabulary))
      .subscribe(
        result => {
          this.importCodesService.vocabulary = {
            ...result,
            sourceNameColumn: result.mappingParams.sourceName
          }
          this.router.navigateByUrl(`${mainPageRouter + codesRouter}/mapping`)
        },
        error => openErrorDialog(this.dialogService, 'Failed to open Vocabulary', parseHttpError(error))
      )
  }

  onRemove(index: number) {
    const vocabulary = this.vocabularies[index]
    this.withLoading$(this.importVocabulariesService.remove(vocabulary))
      .subscribe(
        () => this.vocabularies = this.vocabularies.filter(vocab => vocab !== vocabulary),
        error => openErrorDialog(this.dialogService, 'Failed to remove Vocabulary', parseHttpError(error))
      )
  }

  private withLoading$<T>(request$: Observable<T>) {
    this.loading = true
    return request$
      .pipe(
        finalize(() => this.loading = false)
      )
  }
}
