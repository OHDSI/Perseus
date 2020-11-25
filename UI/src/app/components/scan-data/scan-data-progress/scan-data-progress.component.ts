import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { DbSettings } from '../model/db-settings';
import { WhiteRabbitWebsocketService } from '../../../websocket/white-rabbit/white-rabbit-websocket.service';
import { ProgressNotification, ProgressNotificationStatusCode } from '../model/progress-notification';
import { whiteRabbitPrefix, whiteRabbitUrl } from '../../../app.constants';

@Component({
  selector: 'app-scan-data-progress',
  templateUrl: './scan-data-progress.component.html',
  styleUrls: ['./scan-data-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanDataProgressComponent implements OnInit {

  @Input()
  dbSettings: DbSettings;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  scanningFinished = false;

  progressNotifications: ProgressNotification[] = [];

  // Percent
  progressValue = 0;

  private webSocketConfig = {
    url: whiteRabbitUrl,
    prefix: whiteRabbitPrefix,
    endPoint: '/scan-report/db'
  };

  private scannedTablesCount = -1;

  constructor(private whiteRabbitWebsocketService: WhiteRabbitWebsocketService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.whiteRabbitWebsocketService.connect(this.webSocketConfig)
      .subscribe(result => {
        if (result) {
          this.sendScanConfig();
          this.subscribeOnProgressMessages();
        }
      });
  }

  abort() {
    this.whiteRabbitWebsocketService.disconnect();
  }

  onClose() {
    this.close.emit();
  }

  onAbortAndCancel() {
    this.abort();
    this.cancel.emit();
  }

  private sendScanConfig(): void {
    this.whiteRabbitWebsocketService
      .send('/scan-report/db', JSON.stringify(this.dbSettings));
  }

  private subscribeOnProgressMessages(): void {
    this.whiteRabbitWebsocketService
      .on('/user/queue/reply')
      .subscribe(message => {
        const notification = JSON.parse(message) as ProgressNotification;

        switch (notification.status.code) {
          case ProgressNotificationStatusCode.STARTED_SCANNING:
          case ProgressNotificationStatusCode.ERROR: {
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.TABLE_SCANNING: {
            this.scannedTablesCount++;
            this.progressValue = this.scannedTablesCount / this.dbSettings.tablesToScanCount * 100;
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.SCAN_REPORT_GENERATED: {
            this.progressValue = 100;
            this.scanningFinished = true;
            this.showNotificationMessage(notification);
            this.whiteRabbitWebsocketService.disconnect();
            // todo download report
            break;
          }
          case ProgressNotificationStatusCode.FAILED_TO_SCAN: {
            this.progressValue = 0;
            this.showNotificationMessage(notification);
            this.whiteRabbitWebsocketService.disconnect();
            break;
          }
        }
      });
  }

  private showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
    this.cdr.detectChanges();
  }
}
