import { Component } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { ScanDataUploadService } from '../../../services/scan-data-upload.service';
import { base64ToFileAsObservable, getBase64Header, MediaType } from '../../../util/base64-util';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-console-wrapper.component.html',
  styleUrls: ['scan-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  private reportName = 'ScanReport.xlsx';

  constructor(private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  onSaveReport() {
    base64ToFileAsObservable(this.result, this.reportName)
      .subscribe(file => saveAs(file));
  }

  onUploadReport() {
    this.scanDataUploadService.uploadScanReport(this.result, this.reportName)
      .subscribe(() => this.close.emit());
  }

  onFinish(base64: string) {
    this.result = getBase64Header(MediaType.XLSX) + base64;
  }
}
