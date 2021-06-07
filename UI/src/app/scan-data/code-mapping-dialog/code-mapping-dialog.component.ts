import { Component, ViewChild } from '@angular/core';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CodeMappingConsoleWrapperComponent } from './code-mapping-console-wrapper/code-mapping-console-wrapper.component';
import { ImportCodesMediatorService } from '@services/import-codes/import-codes-mediator.service';

@Component({
  selector: 'app-code-mapping-dialog',
  templateUrl: './code-mapping-dialog.component.html',
  styleUrls: [
    './code-mapping-dialog.component.scss',
    '../styles/scan-dialog.scss',
    '../styles/scan-data-normalize.scss'
  ]
})
export class CodeMappingDialogComponent extends AbstractScanDialog {

  @ViewChild(CodeMappingConsoleWrapperComponent)
  consoleWrapperComponent: CodeMappingConsoleWrapperComponent;

  constructor(dialogRef: MatDialogRef<CodeMappingDialogComponent>,
              public importCodesMediatorService: ImportCodesMediatorService) {
    super(dialogRef);
  }

  onCompleted() {
    this.dialogRef.close(true)
  }

  protected changeSize() {
    this.dialogRef.updateSize('613px', '478px');
  }
}
