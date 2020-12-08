import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import { WhiteRabbitWebsocketService } from '../../../../websocket/white-rabbit/white-rabbit-websocket.service';
import { ProgressNotification, ProgressNotificationStatusCode } from '../../../model/progress-notification';
import { whiteRabbitPrefix, whiteRabbitUrl } from '../../../../app.constants';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base/base.component';
import { WebsocketParams } from '../../../model/websocket-params';

@Component({
  selector: 'app-scan-data-console',
  templateUrl: './scan-data-console.component.html',
  styleUrls: ['./scan-data-console.component.scss']
})
export class ScanDataConsoleComponent extends BaseComponent implements OnInit {

  scanningStarted = false;

  progressNotifications: ProgressNotification[] = [];

  // Percent
  progressValue = 0;

  @Input()
  params: WebsocketParams;

  @Output()
  finish = new EventEmitter<string>();

  private webSocketConfig = {
    url: whiteRabbitUrl,
    prefix: whiteRabbitPrefix,
    progressMessagesDestination: '/user/queue/reply',
  };

  private scannedItemsCount = 0;

  constructor(private whiteRabbitWebsocketService: WhiteRabbitWebsocketService) {
    super();
  }

  ngOnInit(): void {
    this.whiteRabbitWebsocketService.connect({
      ...this.webSocketConfig, endPoint: this.params.destination
    })
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        result => {
          if (result && !this.scanningStarted) {
            this.scanningStarted = true;
            this.sendData();
            this.subscribeOnProgressMessages();
            this.subscribeOnResult();
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
    this.whiteRabbitWebsocketService.disconnect();
  }

  private sendData(): void {
    this.whiteRabbitWebsocketService
      .send(this.params.destination, JSON.stringify(this.params.payload));
  }

  private subscribeOnProgressMessages(): void {
    this.whiteRabbitWebsocketService
      .on(this.webSocketConfig.progressMessagesDestination)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(message => {
        const notification = JSON.parse(message) as ProgressNotification;

        switch (notification.status.code) {
          case ProgressNotificationStatusCode.STARTED:
          case ProgressNotificationStatusCode.ERROR:
          case ProgressNotificationStatusCode.NONE: {
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.TABLE_SCANNING: {
            this.progressValue = this.scannedItemsCount / this.params.itemsToScanCount * 100;
            this.scannedItemsCount++;
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.FINISHED: {
            this.progressValue = 100;
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.FAILED: {
            this.progressValue = 0;
            this.whiteRabbitWebsocketService.disconnect();
            this.showNotificationMessage(notification);
            break;
          }
        }
      });
  }

  private subscribeOnResult(): void {
    this.whiteRabbitWebsocketService
      .on(this.params.resultDestination)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.whiteRabbitWebsocketService.disconnect();
        this.finish.emit('succeeded');
      });
  }

  private showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
  }
}
