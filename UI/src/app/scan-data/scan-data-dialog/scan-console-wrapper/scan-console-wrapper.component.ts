import { Component, Input, ViewChild } from '@angular/core';
import { ScanDataUploadService } from '@services/white-rabbit/scan-data-upload.service';
import { saveAs } from 'file-saver';
import { ScanDataService } from '@services/white-rabbit/scan-data.service';
import { ProgressConsoleWrapperComponent } from '@scan-data/auxiliary/progress-console-wrapper/progress-console-wrapper.component';
import { Conversion } from '@models/conversion/conversion'
import { Observable } from 'rxjs'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { MatDialog } from '@angular/material/dialog'
import { openErrorDialog, parseHttpError } from '@utils/error'
import { withLoadingField } from '@utils/loading'

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-console-wrapper.component.html',
  styleUrls: [
    'scan-console-wrapper.component.scss',
    '../../auxiliary/progress-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class ScanConsoleWrapperComponent extends ProgressConsoleWrapperComponent {
  @Input()
  conversion: Conversion

  @Input()
  project: string

  @ViewChild(ProgressConsoleComponent)
  consoleComponent: ProgressConsoleComponent

  savingReport = false;
  linkingTables = false;

  constructor(private whiteRabbitService: ScanDataService,
              private scanDataUploadService: ScanDataUploadService,
              private dialogService: MatDialog) {
    super()
  }

  get scanReportFileName(): string {
    return `${this.project}.xlsx`
  }

  conversionInfoRequest(): Observable<Conversion> {
    if (this.conversion.dataConnectionService !== undefined) {
      return this.conversion.dataConnectionService.sourceConnection.conversionInfoWithLogs()
    } else {
      return this.whiteRabbitService.conversionInfoWithLogs(this.conversion.id)
    }
  }

  onAbortAndCancel(): void {
    this.whiteRabbitService.abort(this.conversion.id)
      .subscribe(() => this.back.emit())
  }

  onSaveReport(): void {
    this.whiteRabbitService.downloadScanReport(this.conversion.id)
      .pipe(
        withLoadingField(this, 'savingReport')
      )
      .subscribe(
        file => saveAs(file, this.scanReportFileName)
      )
  }

  onUploadReport(): void {
    this.scanDataUploadService.uploadScanReport(this.conversion.id, this.conversion.dataConnectionService)
    .pipe(
      withLoadingField(this, 'linkingTables')
    )
    .subscribe(
      () => this.close.emit(this.conversion),
      error => openErrorDialog(this.dialogService, 'Cannot link tables', parseHttpError(error))
    )
  }
}
