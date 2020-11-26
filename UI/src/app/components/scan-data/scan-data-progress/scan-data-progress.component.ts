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
import { saveAs } from 'file-saver';
import { base64ToFile, getBase64Header, MediaType } from '../../../util/base64-util';
import { ScanDataUploadService } from '../scan-data-upload.service';
import { BaseComponent } from '../../../common/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scan-data-progress',
  templateUrl: './scan-data-progress.component.html',
  styleUrls: ['./scan-data-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanDataProgressComponent extends BaseComponent implements OnInit {

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

  // With header
  private reportBase64: string;

  private reportName = 'ScanReport';

  private reportExtension = '.xlsx';

  private webSocketConfig = {
    url: whiteRabbitUrl,
    prefix: whiteRabbitPrefix,
    endPoint: '/scan-report/db'
  };

  private scannedTablesCount = -1;

  constructor(private whiteRabbitWebsocketService: WhiteRabbitWebsocketService,
              private scanDataUploadService: ScanDataUploadService,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.whiteRabbitWebsocketService.connect(this.webSocketConfig)
      .subscribe(result => {
        if (result) {
          this.sendScanConfig();
          this.subscribeOnProgressMessages();
          this.subscribeOnScanReport();
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

  back() {
    this.cancel.emit();
  }


  async saveReport() {
    const file = await base64ToFile(this.reportBase64, this.reportName + this.reportExtension);
    saveAs(file);
  }

  uploadReport() {
    this.scanDataUploadService.uploadScanReport(this.reportBase64, this.reportName + this.reportExtension)
      .subscribe(() => this.close.emit());
  }

  private sendScanConfig(): void {
    this.whiteRabbitWebsocketService
      .send('/scan-report/db', JSON.stringify(this.dbSettings));
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
            this.showNotificationMessage(notification);
            break;
          }
          case ProgressNotificationStatusCode.FAILED_TO_SCAN: {
            this.progressValue = 0;
            this.showNotificationMessage(notification);
            this.whiteRabbitWebsocketService.disconnect();
            break;
          }
          case ProgressNotificationStatusCode.NONE: {
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
        this.cdr.detectChanges();
      });
  }

  private showNotificationMessage(notification: ProgressNotification) {
    this.progressNotifications.push(notification);
    this.cdr.detectChanges();
  }
}
