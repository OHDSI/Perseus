import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportCodesService } from '../../../services/import-codes/import-codes.service';
import { Router } from '@angular/router';
import { codesRouter, mainPageRouter } from '../../../app.constants';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { openErrorDialog, parseHttpError } from '../../../utilites/error';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { SaveVocabularyPopupComponent } from './save-vocabulary-popup/save-vocabulary-popup.component';

@Component({
  selector: 'app-mapping-codes',
  templateUrl: './mapping-codes.component.html',
  styleUrls: ['./mapping-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MappingCodesComponent {

  loading = false

  term: string

  constructor(private importCodesService: ImportCodesService,
              private router: Router,
              private dialogService: MatDialog) {
  }

  get applyDisabled() {
    return this.importCodesService.codeMappings.every(codeMapping => !codeMapping.approved)
  }

  onBack() {
    this.importCodesService.codeMappings = null
    this.router.navigateByUrl(mainPageRouter + codesRouter)
  }

  onSave() {
    this.dialogService.open(SaveVocabularyPopupComponent, {
      panelClass: 'perseus-dialog',
      disableClose: true
    }).afterClosed()
      .pipe(
        tap(() => this.loading = true),
        switchMap(name => name ? this.importCodesService.saveCodes(name) : EMPTY),
        finalize(() => this.loading = false)
      )
      .subscribe(
        () => {
          this.importCodesService.reset()
          this.router.navigateByUrl(mainPageRouter + codesRouter)
        },
        error => openErrorDialog(this.dialogService, 'Failed to save Codes', parseHttpError(error))
      )
  }
}
