import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImportVocabulariesService } from '@services/usagi/import-vocabularies.service';
import { withLoading } from '@utils/loading';
import { filter, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConfirmOverwriteVocabComponent } from '@code-mapping/mapping-codes/save-vocabulary-popup/confirm-overwrite-vocab/confirm-overwrite-vocab.component';
import { ImportCodesService } from '@services/usagi/import-codes.service';

@Component({
  selector: 'app-save-vocabulary-popup',
  templateUrl: './save-vocabulary-popup.component.html',
  styleUrls: ['./save-vocabulary-popup.component.scss']
})
export class SaveVocabularyPopupComponent implements OnInit {

  loading = false

  vocabularyName: string

  isExisted: boolean

  constructor(public dialogRef: MatDialogRef<SaveVocabularyPopupComponent>,
              private dialogService: MatDialog,
              private importVocabulariesService: ImportVocabulariesService,
              private importCodesService: ImportCodesService) {
  }

  ngOnInit() {
    this.isExisted = this.importCodesService.isExisted
    if (this.isExisted) {
      this.vocabularyName = this.importCodesService.vocabularyName
    }
  }

  onApply(name) {
    if (this.isExisted) {
      this.applyExisted(name)
    } else {
      this.applyNew(name)
    }
  }

  private openConfirmOverwriteDialog(): Observable<boolean> {
    const dialogRef = this.dialogService.open(ConfirmOverwriteVocabComponent, {
      disableClose: true,
      panelClass: 'perseus-dialog'
    })
    return dialogRef.afterClosed()
  }

  private applyNew(name: string) {
    this.importVocabulariesService.nameList()
      .pipe(
        withLoading(this),
        map(vocabs => vocabs.includes(name)),
        switchMap(exist => exist ? this.openConfirmOverwriteDialog() : of(true)),
        filter(doSave => doSave)
      )
      .subscribe(() => this.dialogRef.close(name))
  }

  private applyExisted(name: string) {
    this.dialogRef.close(name)
  }
}
