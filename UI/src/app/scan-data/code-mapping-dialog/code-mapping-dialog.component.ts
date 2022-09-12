import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CodeMappingConsoleWrapperComponent } from './code-mapping-console-wrapper/code-mapping-console-wrapper.component';
import { ConversionDialog } from '@scan-data/conversion-dialog'
import { ImportCodesService } from '@services/usagi/import-codes.service'
import { withLoading } from '@utils/loading'
import { openErrorDialog, parseHttpError } from '@utils/error'

@Component({
  selector: 'app-code-mapping-dialog',
  templateUrl: './code-mapping-dialog.component.html',
  styleUrls: [
    './code-mapping-dialog.component.scss',
    '../styles/scan-dialog.scss',
    '../styles/scan-data-normalize.scss'
  ]
})
export class CodeMappingDialogComponent extends ConversionDialog implements OnInit {

  @ViewChild(CodeMappingConsoleWrapperComponent)
  consoleWrapperComponent: CodeMappingConsoleWrapperComponent;

  loading = false

  constructor(dialogRef: MatDialogRef<CodeMappingDialogComponent>,
              private usagiService: ImportCodesService,
              private dialogService: MatDialog) {
    super(dialogRef);
  }

  ngOnInit(): void {
    this.usagiService.calculateScore()
      .pipe(withLoading(this))
      .subscribe(
        conversion => this.conversion = conversion,
        error => openErrorDialog(this.dialogService, 'Code mapping error', parseHttpError(error))
      )
  }

  onCompleted() {
    this.dialogRef.close(true)
  }

  onCancel() {
    this.dialogRef.close(false)
  }

  protected changeSize() {
    this.dialogRef.updateSize('613px', '478px');
  }
}
