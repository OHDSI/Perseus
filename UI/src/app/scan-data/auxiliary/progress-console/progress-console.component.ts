import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { ProgressLog } from '@models/progress-console/progress-log'
import { BaseComponent } from '@shared/base/base.component'
import { ProgressLogStatus } from '@models/progress-console/progress-log-status'

@Component({
  selector: 'progress-console',
  templateUrl: 'progress-console.component.html',
  styleUrls: ['progress-console.component.scss']
})
export class ProgressConsoleComponent extends BaseComponent {
  progressValuePercent = 0
  color: ThemePalette = 'primary'
  private progressLogs: ProgressLog[] = []

  @ViewChild('console')
  private console: ElementRef;

  get logs(): ProgressLog[] {
    return this.progressLogs
  }

  @Input()
  set logs(logs: ProgressLog[]) {
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1]
      this.progressLogs = logs
      this.progressValuePercent = lastLog.percent
      this.scrollToConsoleBottom()
    }
  }

  addErrorLog(message: string) {
    this.logs.push({
      message,
      statusCode: ProgressLogStatus.ERROR,
      statusName: 'ERROR',
      percent: 100
    })
    this.scrollToConsoleBottom()
  }

  changeProgressColorToError(): void {
    this.color = 'warn'
  }

  private scrollToConsoleBottom() {
    const console = this.console.nativeElement;
    // delayed scroll, after render new message
    setTimeout(() =>
      console.scrollTop = console.scrollHeight - console.clientHeight
    );
  }
}
