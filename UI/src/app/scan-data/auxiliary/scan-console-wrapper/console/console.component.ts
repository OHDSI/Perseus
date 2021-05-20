import { ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  ProgressNotification,
  ProgressNotificationStatusCode
} from '../../../../models/scan-data/progress-notification';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base/base.component';
import { WebsocketParams } from '../../../../models/scan-data/websocket-params';
import { WebsocketService } from '../../../../websocket/websocket.service';

export abstract class ConsoleComponent extends BaseComponent implements OnInit, OnDestroy {

  scanningStarted = false;

  progressNotifications: ProgressNotification[] = [];

  // Percent
  progressValue = 0;

  @Input()
  params: WebsocketParams;

  @Output()
  finish = new EventEmitter<any>();

  @ViewChild('console')
  private console: ElementRef;

  protected constructor(protected websocketService: WebsocketService) {
    super();
  }

  ngOnInit(): void {
    this.websocketService.connect()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        result => {
          if (result && !this.scanningStarted) {
            this.onConnect();
          }
        }, error => {
          this.showNotificationMessage({
            message: this.websocketService.handleError(error),
            status: {
              code: ProgressNotificationStatusCode.FAILED
            }
          });
        }
      );
  }

  abortAndCancel() {
    this.websocketService.disconnect();
  }

  showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
    this.scrollToConsoleBottom();
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

  protected abstract handleProgressMessage(message: any): void;

  protected scrollToConsoleBottom() {
    const console = this.console.nativeElement;
    // delayed scroll, after render new message
    setTimeout(() =>
      console.scrollTop = console.scrollHeight - console.clientHeight
    );
  }
}
