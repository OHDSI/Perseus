import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import { ProgressNotification, ProgressNotificationStatusCode } from '../../../model/progress-notification';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base/base.component';
import { WebsocketParams } from '../../../model/websocket-params';
import { WebsocketService } from '../../../../websocket/webscoket.service';
import { WebsocketConfigurationService } from '../../../../websocket/websocket-configuration.service';
import { WhiteRabbitWebsocketService } from '../../../../websocket/white-rabbit/white-rabbit-websocket.service';
import { CdmBuilderWebsocketService } from '../../../../websocket/cdm-builder/cdm-builder-websocket.service';

@Component({
  selector: 'app-scan-data-console',
  templateUrl: './scan-data-console.component.html',
  styleUrls: ['./scan-data-console.component.scss'],
  providers: [
    {
      provide: WebsocketService,
      useFactory: (configurationService: WebsocketConfigurationService) => {
        return configurationService.name === WhiteRabbitWebsocketService.name
          ? new WhiteRabbitWebsocketService() : new CdmBuilderWebsocketService();
      },
      deps: [WebsocketConfigurationService]
    }
  ]
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

  private scannedItemsCount = 0;

  constructor(private websocketService: WebsocketService) {
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
    this.websocketService.disconnect();
  }

  private sendData(): void {
    this.websocketService
      .send(this.params.endPoint, JSON.stringify(this.params.payload));
  }

  private subscribeOnProgressMessages(): void {
    this.websocketService
      .on(this.params.progressMessagesDestination)
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
            this.websocketService.disconnect();
            this.showNotificationMessage(notification);
            break;
          }
        }
      });
  }

  private subscribeOnResult(): void {
    this.websocketService
      .on(this.params.resultDestination)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(result => {
        this.websocketService.disconnect();
        this.finish.emit(result);
      });
  }

  private showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
  }
}
