import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DqdConsoleWrapperComponent } from './dqd-console-wrapper/dqd-console-wrapper.component';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { ConversionDialog } from '@scan-data/conversion-dialog'
import { DataQualityCheckService } from '@services/data-quality-check/data-quality-check.service'
import { Conversion } from '@models/conversion/conversion'
import { ConversionDialogStatus } from '@scan-data/conversion-dialog-status'
import { openErrorDialog, parseHttpError } from '@utils/error'

@Component({
  selector: 'app-dqd-dialog',
  templateUrl: './dqd-dialog.component.html',
  styleUrls: [
    './dqd-dialog.component.scss',
    '../styles/scan-dialog.scss',
    '../styles/scan-data-normalize.scss'
  ]
})
export class DqdDialogComponent extends ConversionDialog {

  @ViewChild(DqdConsoleWrapperComponent)
  consoleWrapperComponent: DqdConsoleWrapperComponent;

  conversion: Conversion | null
  project: string

  constructor(dialogRef: MatDialogRef<DqdDialogComponent>,
              private dataQualityCheckService: DataQualityCheckService,
              private dialogService: MatDialog) {
    super(dialogRef);
  }

  onDataQualityCheck(dbSettings: DbSettings): void {
    this.dataQualityCheckService.dataQualityCheck(dbSettings)
      .subscribe(conversion => {
        this.conversion = conversion
        this.project = conversion.project
        this.index = ConversionDialogStatus.CONVERSION
      }, error => {
        openErrorDialog(this.dialogService, 'Failed to data quality check', parseHttpError(error))
      })
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('367px', '674px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
