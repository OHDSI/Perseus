import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { ProgressLog } from '@models/progress-console/progress-log'
import { BaseComponent } from '@shared/base/base.component'
import { ProgressLogStatus } from '@models/progress-console/progress-log-status'
import { interval, Observable, Subscription } from 'rxjs'
import { Conversion } from '@models/conversion/conversion'
import { exhaustMap, takeUntil } from 'rxjs/operators'
import { parseHttpError } from '@utils/error'
import { ConversionStatus } from '@models/conversion/conversion-status'

@Component({
  template: ``
})
export abstract class ProgressConsoleComponent extends BaseComponent implements OnInit {
  public static LOGS_REQUEST_INTERVAL = 2500

  progressValuePercent = 0
  color: ThemePalette = 'primary'
  private logsSub: Subscription
  private progressLogs: ProgressLog[] = []

  @ViewChild('console')
  private console: ElementRef;

  get logs(): ProgressLog[] {
    return this.progressLogs
  }

  set logs(logs: ProgressLog[]) {
    const lastLog = logs[logs.length - 1]
    this.progressLogs = logs
    this.progressValuePercent = lastLog.percent
    this.scrollToConsoleBottom()
  }

  ngOnInit() {
    this.logsSub = interval(ProgressConsoleComponent.LOGS_REQUEST_INTERVAL)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        exhaustMap(() => this.logsRequest())
      )
      .subscribe(
        logs =>
          this.logs = logs,
        error => {
          this.addErrorLog(parseHttpError(error))
        }
      )
  }

  abstract logsRequest(): Observable<ProgressLog[]>

  stopLogging(conversion: Conversion) {
    this.logsSub.unsubscribe()
    if (conversion.statusCode === ConversionStatus.FAILED) {
      this.color = 'warn'
      if (this.progressLogs.length === 0) {
        this.addErrorLog('Process failed')
      }
    }
  }

  protected addErrorLog(message: string) {
    this.logs.push({
      message,
      statusCode: ProgressLogStatus.ERROR,
      statusName: 'ERROR',
      percent: 100
    })
    this.scrollToConsoleBottom()
  }

  private scrollToConsoleBottom() {
    const console = this.console.nativeElement;
    // delayed scroll, after render new message
    setTimeout(() =>
      console.scrollTop = console.scrollHeight - console.clientHeight
    );
  }
}
