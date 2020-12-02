import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { WhiteRabbitWebsocketService } from '../../../websocket/white-rabbit/white-rabbit-websocket.service';
import { ProgressNotification, ProgressNotificationStatusCode } from '../../model/progress-notification';
import { whiteRabbitPrefix, whiteRabbitUrl } from '../../../app.constants';
import { saveAs } from 'file-saver';
import { base64ToFileAsObservable, getBase64Header, MediaType } from '../../../util/base64-util';
import { ScanDataUploadService } from '../../../services/scan-data-upload.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { ScanSettingsWrapper } from '../../model/scan-settings-wrapper';

@Component({
  selector: 'app-scan-data-console',
  templateUrl: './scan-data-console.component.html',
  styleUrls: ['./scan-data-console.component.scss']
})
export class ScanDataConsoleComponent extends BaseComponent implements OnInit {

  @Input()
  scanSettingsWrapper: ScanSettingsWrapper;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  scanningFinished = false;

  scanningStarted = false;

  progressNotifications: ProgressNotification[] = [];

  // Percent
  progressValue = 0;

  // With header
  private reportBase64: string;

  private reportName = 'ScanReport.xlsx';

  private webSocketConfig = {
    url: whiteRabbitUrl,
    prefix: whiteRabbitPrefix
  };

  private scannedTablesCount = -1;

  constructor(private whiteRabbitWebsocketService: WhiteRabbitWebsocketService,
              private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  ngOnInit(): void {
    this.whiteRabbitWebsocketService.connect({
      ...this.webSocketConfig, endPoint: this.scanSettingsWrapper.getScanServiceDestination()
    })
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        result => {
          if (result && !this.scanningStarted) {
            this.scanningStarted = true;
            this.sendScanConfig();
            this.subscribeOnProgressMessages();
            this.subscribeOnScanReport();
          }
        }, error => {
          this.showNotificationMessage({
            message: `Error: ${error.reason}`,
            status: null
          });
        }
      );
  }

  onAbortAndCancel() {
    this.whiteRabbitWebsocketService.disconnect();
    this.cancel.emit();
  }

  onUploadReport() {
    this.scanDataUploadService.uploadScanReport(this.reportBase64, this.reportName)
      .subscribe(() => this.close.emit());
  }

  onSaveReport() {
    base64ToFileAsObservable(this.reportBase64, this.reportName)
      .subscribe(file => saveAs(file));
  }

  private sendScanConfig(): void {
    this.whiteRabbitWebsocketService
      .send(this.scanSettingsWrapper.getScanServiceDestination(), JSON.stringify(this.scanSettingsWrapper.scanSettings));
  }

  private subscribeOnProgressMessages(): void {
    this.whiteRabbitWebsocketService
      .on('/user/queue/reply')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(message => {
        const notification = JSON.parse(message) as ProgressNotification;

        switch (notification.status.code) {
          case ProgressNotificationStatusCode.STARTED_SCANNING:
          case ProgressNotificationStatusCode.ERROR:
          case ProgressNotificationStatusCode.NONE: {
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.TABLE_SCANNING: {
            this.scannedTablesCount++;
            this.progressValue = this.scannedTablesCount / this.scanSettingsWrapper.scanSettings.itemsToScanCount * 100;
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.SCAN_REPORT_GENERATED: {
            this.progressValue = 100;
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.FAILED_TO_SCAN: {
            this.progressValue = 0;
            this.whiteRabbitWebsocketService.disconnect();
            this.showNotificationMessage(notification);
            break;
          }
        }
      });
  }

  private subscribeOnScanReport(): void {
    this.whiteRabbitWebsocketService
      .on('/user/queue/scan-report')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(reportBase64 => {
        this.reportBase64 = getBase64Header(MediaType.XLSX) + reportBase64;
        this.scanningFinished = true;
        this.whiteRabbitWebsocketService.disconnect();
      });
  }

  private showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
  }
}
