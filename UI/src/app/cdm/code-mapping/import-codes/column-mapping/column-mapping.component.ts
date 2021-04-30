import { Component, OnInit } from '@angular/core';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { codesRouter } from '../../../../app.constants';
import { MatDialog } from '@angular/material/dialog';
import { openErrorDialog, parseHttpError } from '../../../../utilites/error';

@Component({
  selector: 'app-column-mapping',
  templateUrl: './column-mapping.component.html',
  styleUrls: [
    './column-mapping.component.scss',
    '../styles/column-mapping-panel.scss',
    '../styles/import-codes-wrapper.scss'
  ]
})
export class ColumnMappingComponent implements OnInit {

  form: FormGroup

  checkedAll: boolean;

  constructor(public importCodesService: ImportCodesService,
              private router: Router,
              private dialogService: MatDialog) {
  }

  ngOnInit(): void {
    this.initForm()

    this.setCheckedAll()
  }

  onBack() {
    this.importCodesService.reset()
  }

  onApply() {
    this.importCodesService.calculateScore(this.form.value)
      .subscribe(
        () => this.router.navigateByUrl(`${codesRouter}/mapping`),
        error => openErrorDialog(this.dialogService, 'Failed to create Mapping', parseHttpError(error))
      )
  }

  private initForm() {
    this.form = new FormGroup({
      sourceCode: new FormControl(null),
      sourceName: new FormControl(null, [Validators.required]),
      sourceFrequency: new FormControl(null),
      autoConceptId: new FormControl(null),
      additionalInfo: new FormControl(null),
    })
  }

  private setCheckedAll() {
    this.checkedAll = this.importCodesService.codes.every(code => code.selected)
  }
}
