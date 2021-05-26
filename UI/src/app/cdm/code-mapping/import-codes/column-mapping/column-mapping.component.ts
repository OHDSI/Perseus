import { Component, OnInit } from '@angular/core';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { codesRouter, mainPageRouter } from '../../../../app.constants';
import { MatDialog } from '@angular/material/dialog';
import { openErrorDialog, parseHttpError } from '../../../../utilites/error';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { CodeMappingDialogComponent } from '../../../../scan-data/code-mapping-dialog/code-mapping-dialog.component';
import { BaseComponent } from '../../../../shared/base/base.component';
import { createFiltersForm } from '../../../../models/code-mapping/filters';
import { ImportCodesMediatorService } from '../../../../services/import-codes/import-codes-mediator.service';
import { mapFormFiltersToBackEndFilters } from '../../../../models/code-mapping/search-concept-filters';

@Component({
  selector: 'app-column-mapping',
  templateUrl: './column-mapping.component.html',
  styleUrls: [
    './column-mapping.component.scss',
    '../styles/column-mapping-panel.scss',
    '../styles/import-codes-wrapper.scss'
  ]
})
export class ColumnMappingComponent extends BaseComponent implements OnInit {

  form: FormGroup

  filtersForm: FormGroup

  constructor(public importCodesService: ImportCodesService,
              private importCodesMediatorService: ImportCodesMediatorService,
              private router: Router,
              private dialogService: MatDialog) {
    super()
  }

  get applyDisabled() {
    return this.form.invalid || this.importCodesService.codes.every(code => !code.selected)
  }

  ngOnInit(): void {
    this.initForm()

    this.initFiltersForm()
  }

  onBack() {
    this.importCodesService.reset()
  }

  onApply() {
    this.importCodesService.mappingParams = this.form.value
    this.importCodesService.filters = mapFormFiltersToBackEndFilters(this.filtersForm.value)
    this.importCodesMediatorService.onWebsocketConnect$ = this.importCodesService.calculateScore()

    this.dialogService
      .open(CodeMappingDialogComponent, { panelClass: 'scan-data-dialog', disableClose: true })
      .afterClosed()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(value => value),
        switchMap(() => this.importCodesService.getCodesMappings())
      )
      .subscribe(
        () => this.router.navigateByUrl(`${mainPageRouter + codesRouter}/mapping`),
        error => openErrorDialog(this.dialogService, 'Failed to create Mapping', parseHttpError(error))
      )
  }

  private initForm() {
    this.form = new FormGroup({
      sourceCode: new FormControl(null),
      sourceName: new FormControl(null, [Validators.required]),
      sourceFrequency: new FormControl(null),
      columnType: new FormControl(null),
      autoConceptId: new FormControl(null),
      additionalInfo: new FormControl(null)
    })
    const formValue = this.importCodesService.mappingParams
    if (formValue) {
      this.form.patchValue(formValue)
    }
  }

  private initFiltersForm() {
    this.filtersForm = createFiltersForm()
    const formValue = this.importCodesService.filters
    if (formValue) {
      this.filtersForm.patchValue(formValue)
    }
  }
}
