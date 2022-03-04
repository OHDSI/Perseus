import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  CdmProgressNotification,
  ProgressNotification,
  ProgressNotificationStatus,
  ProgressNotificationStatusCode,
  toFailedMessage
} from '@models/scan-data/progress-notification';
import { filter, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { WebsocketParams } from '@models/scan-data/websocket-params';
import { WebsocketService } from '@websocket/websocketService';
import { ThemePalette } from '@angular/material/core';
import { ScanResult, ScanStatus } from '@models/scan-data/scan-result';

/**
 * @deprecated Use ProgressConsoleComponent
 */
@Component({
  template: ''
})
export abstract class ConsoleComponent<T> extends BaseComponent implements OnInit {

  scanningStarted = false;

  notifications: ProgressNotification[] = [];

  // Percent
  progressValue = 0;

  color: ThemePalette = 'primary'

  @Input()
  params: WebsocketParams;

  @Output()
  completion = new EventEmitter<ScanResult<T>>();

  @ViewChild('console')
  private console: ElementRef;

  protected constructor(protected websocketService: WebsocketService) {
    super();
  }

  ngOnInit(): void {
    this.websocketService.connect()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(result => result && !this.scanningStarted)
      )
      .subscribe(
        () => this.onConnect(),
        error => {
          this.showNotificationMessage(toFailedMessage(this.websocketService.handleError(error)))
          this.onFailed()
        }
      );
  }

  abortAndCancel() {
    this.websocketService.disconnect();
  }

  showNotificationMessage(notification: ProgressNotification) {
    this.notifications.push(notification);
    this.scrollToConsoleBottom();
  }

  isErrorMessage(status: ProgressNotificationStatus) {
    return status.code === ProgressNotificationStatusCode.FAILED ||
      status.code === ProgressNotificationStatusCode.ERROR
  }

  protected onConnect(): void {
    this.scanningStarted = true;
    this.subscribeOnProgressMessages();
    this.sendData();
  }

  protected sendData(): void {
    this.websocketService.send(this.params.payload);
  }

  protected subscribeOnProgressMessages(): void {
    this.websocketService.on()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        message => this.handleProgressMessage(message),
        error => this.showNotificationMessage({
          message: this.websocketService.handleError(error),
          status: {
            code: ProgressNotificationStatusCode.ERROR
          }
        })
      );
  }

  protected abstract handleProgressMessage(notification: string | ProgressNotification | CdmProgressNotification): void;

  protected scrollToConsoleBottom() {
    const console = this.console.nativeElement;
    // delayed scroll, after render new message
    setTimeout(() =>
      console.scrollTop = console.scrollHeight - console.clientHeight
    );
  }

  protected onSuccess(payload: T) {
    this.websocketService.disconnect()
    this.progressValue = 100
    this.completion.emit({status: ScanStatus.SUCCESSFULLY, payload})
  }

  protected onFailed() {
    this.websocketService.disconnect();
    this.color = 'warn'
    this.progressValue = 100
    this.completion.emit({status: ScanStatus.FAILED})
  }
}
