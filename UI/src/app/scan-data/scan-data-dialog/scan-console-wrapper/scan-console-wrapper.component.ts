import { Component, Input, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { ScanDataUploadService } from '../../../services/scan-data-upload.service';
import { base64ToFileAsObservable, getBase64Header, MediaType } from '../../../services/utilites/base64-util';
import { saveAs } from 'file-saver';
import { WhiteRabbitScanDataConsoleComponent } from '../../shared/scan-console-wrapper/scan-data-console/white-rabbit-scan-data-console.component';

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-console-wrapper.component.html',
  styleUrls: ['scan-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  @ViewChild(WhiteRabbitScanDataConsoleComponent)
  scanDataConsoleComponent: WhiteRabbitScanDataConsoleComponent;

  @Input()
  private reportName: string;

  constructor(private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  onSaveReport() {
    base64ToFileAsObservable(this.result, `${this.reportName}.xlsx`)
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
