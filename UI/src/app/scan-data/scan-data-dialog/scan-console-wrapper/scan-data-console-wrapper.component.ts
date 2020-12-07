import { Component, Input } from '@angular/core';
import { ConsoleWrapperComponent } from '../../shared/scan-console-wrapper/console-wrapper.component';
import { ScanDataUploadService } from '../../../services/scan-data-upload.service';
import { base64ToFileAsObservable, getBase64Header, MediaType } from '../../../util/base64-util';
import { saveAs } from 'file-saver';
import { WebsocketParams } from '../../model/websocket-params';

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-data-console-wrapper.component.html',
  styleUrls: ['scan-data-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanDataConsoleWrapperComponent extends ConsoleWrapperComponent {

  @Input()
  params: WebsocketParams;

  reportBase64: string;

  private reportName = 'ScanReport.xlsx';

  constructor(private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  onSaveReport() {
    base64ToFileAsObservable(this.reportBase64, this.reportName)
      .subscribe(file => saveAs(file));
  }

  onUploadReport() {
    this.scanDataUploadService.uploadScanReport(this.reportBase64, this.reportName)
      .subscribe(() => this.close.emit());
  }

  onFinish(base64: string) {
    this.reportBase64 = getBase64Header(MediaType.XLSX) + base64;
  }
}
