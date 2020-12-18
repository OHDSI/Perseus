import {
  ElementRef,
  EventEmitter, Input,
  OnInit, Output, ViewChild
} from '@angular/core';
import { ProgressNotification} from '../../../model/progress-notification';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base/base.component';
import { WebsocketParams } from '../../../model/websocket-params';
import { WebsocketService } from '../../../../websocket/webscoket.service';

export abstract class AbstractScanDataConsoleComponent extends BaseComponent implements OnInit {

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
    this.websocketService.connect(this.params)
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
            message: `Error: ${error.reason}`,
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
    this.websocketService
      .send(this.params.endPoint, this.params.payload);
  }

  protected subscribeOnProgressMessages(): void {
    this.websocketService
      .on(this.params.progressMessagesDestination)
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
