import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { ImportVocabulariesService, Vocabulary } from '../../../../services/import-codes/import-vocabularies.service';
import { parseHttpError } from '../../../../utilites/error';
import { MatDialog } from '@angular/material/dialog';
import { SetDelimiterDialogComponent } from '../../../../shared/set-delimiter-dialog/set-delimiter-dialog.component';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

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

  vocabularies: Vocabulary[]

  visibleVocabCount = 3

  showOther = false;

  loading = false;

  error: string;

  @ViewChild('csvInput', {static: true})
  csvInput: ElementRef

  @Output()
  import = new EventEmitter<void>()

  constructor(private importCodesService: ImportCodesService,
              private importVocabulariesService: ImportVocabulariesService,
              private dialogService: MatDialog) {
  }

  ngOnInit(): void {
    this.importVocabulariesService.all()
      .subscribe(vocabularies => this.vocabularies = vocabularies)
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
          switchMap(delimiter => delimiter ? this.importCodesService.loadCsv(csv) : EMPTY)
        )
        .subscribe(
          () => this.import.emit(),
          error => this.error = error
        )
    }
  }

  onEdit(index: number) {
    // todo implementation
    console.log(index)
  }

  onRemove(index: number) {
    this.loading = true
    this.importVocabulariesService.remove(this.vocabularies[index].name)
      .subscribe(() => {
        this.vocabularies = this.importVocabulariesService.vocabularies
        this.loading = false
      }, error => {
        this.error = parseHttpError(error)
        this.loading = false
      })
  }

  onRemoveError() {
    this.error = null
  }
}
