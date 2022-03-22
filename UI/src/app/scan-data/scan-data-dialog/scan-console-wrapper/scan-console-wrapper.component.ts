import { Component, Input, ViewChild } from '@angular/core';
import { ScanDataUploadService } from '@services/white-rabbit/scan-data-upload.service';
import { saveAs } from 'file-saver';
import { ScanDataService } from '@services/white-rabbit/scan-data.service';
import { switchMap } from 'rxjs/operators';
import { blobToFile } from '@utils/file';
import { ProgressConsoleWrapperComponent } from '@scan-data/auxiliary/progress-console-wrapper/progress-console-wrapper.component';
import { Conversion } from '@models/conversion/conversion'
import { Observable } from 'rxjs'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-console-wrapper.component.html',
  styleUrls: [
    'scan-console-wrapper.component.scss',
    '../../auxiliary/scan-console-wrapper/console-wrapper.component.scss',
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

  constructor(private whiteRabbitService: ScanDataService,
              private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  get scanReportFileName(): string {
    return `${this.project}.xlsx`
  }

  conversionInfoRequest(): Observable<Conversion> {
    return this.whiteRabbitService.conversionInfoWithLogs(this.conversion.id)
  }

  onAbortAndCancel(): void {
    this.whiteRabbitService.abort(this.conversion.id)
      .subscribe(() => this.back.emit())
  }

  onSaveReport(): void {
    this.whiteRabbitService.downloadScanReport(this.conversion.id)
      .subscribe(
        file => saveAs(file, this.scanReportFileName)
      )
  }

  onUploadReport(): void {
    this.whiteRabbitService.downloadScanReport(this.conversion.id)
      .pipe(
        switchMap(blob =>
          this.scanDataUploadService.uploadScanReport(blobToFile(blob, this.scanReportFileName))
        )
      )
      .subscribe(
        () => this.close.emit(this.conversion)
      )
  }
}
