import { Component, Input, ViewChild } from '@angular/core';
import { DataQualityCheckService } from '@services/data-quality-check/data-quality-check.service';
import * as fileSaver from 'file-saver';
import { openErrorDialog, parseHttpError } from '@utils/error';
import { ProgressConsoleWrapperComponent } from '@scan-data/auxiliary/progress-console-wrapper/progress-console-wrapper.component'
import { Conversion } from '@models/conversion/conversion'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { Observable } from 'rxjs'
import { withLoading } from '@utils/loading'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-dqd-console-wrapper',
  templateUrl: './dqd-console-wrapper.component.html',
  styleUrls: [
    './dqd-console-wrapper.component.scss',
    '../../auxiliary/scan-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class DqdConsoleWrapperComponent extends ProgressConsoleWrapperComponent {
  @Input()
  conversion: Conversion

  @Input()
  project: string

  @ViewChild(ProgressConsoleComponent)
  consoleComponent: ProgressConsoleComponent;

  loading = false;

  get scanId(): number {
    return this.conversion.id
  }

  constructor(private dataQualityCheckService: DataQualityCheckService,
              private dialogService: MatDialog) {
    super()
  }

  conversionInfoRequest(): Observable<Conversion> {
    return this.dataQualityCheckService.scanInfoWithLogs(this.scanId);
  }

  onAbortAndCancel() {
    this.dataQualityCheckService.abort(this.scanId)
      .subscribe(() => this.back.emit())
  }

  onShowResult() {
    window.open(this.dataQualityCheckService.resultPageUrl(this.scanId), '_blank');
  }

  onSaveResult() {
    this.dataQualityCheckService.downloadJsonResultFile(this.scanId)
      .pipe(
        withLoading(this)
      )
      .subscribe(
        json => {
          const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});
          fileSaver.saveAs(blob, `${this.project}.json`);
        },
        error => openErrorDialog(
          this.dialogService, 'Failed to save result json file', parseHttpError(error)
        )
      );
  }
}

