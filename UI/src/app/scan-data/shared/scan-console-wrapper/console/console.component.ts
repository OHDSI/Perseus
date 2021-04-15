import { ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProgressNotification } from '../../../model/progress-notification';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../base/base.component';
import { WebsocketParams } from '../../../model/websocket-params';
import { WebsocketService } from '../../../../websocket/websocket.service';

export abstract class ConsoleComponent extends BaseComponent implements OnInit {

  scanningStarted = false;

  progressNotifications: ProgressNotification[] = [];

  // Percent
  progressValue = 0;

  @Input()
  params: WebsocketParams;

  @Output()
  finish = new EventEmitter<string>();

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
            status: null
          });
        }
      );
  }

  abortAndCancel() {
    this.websocketService.disconnect();
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
      .subscribe(message => {
        this.handleProgressMessage(message);
      });
  }

  protected showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
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
