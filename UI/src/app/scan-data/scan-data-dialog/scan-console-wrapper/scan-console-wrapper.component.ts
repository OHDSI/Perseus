import { Component, Input, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { ScanDataUploadService } from '../../../services/scan-data-upload.service';
import { saveAs } from 'file-saver';
import { ScanDataConsoleComponent } from './scan-data-console/scan-data-console.component';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { switchMap } from 'rxjs/operators';
import { blobToFile } from '../../util/file';

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-console-wrapper.component.html',
  styleUrls: ['scan-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  result: string // scan-report server file location

  @ViewChild(ScanDataConsoleComponent)
  scanDataConsoleComponent: ScanDataConsoleComponent;

  @Input()
  private reportName: string;  // Without extension

  constructor(private whiteRabbitService: WhiteRabbitService,
              private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  onSaveReport() {
    this.whiteRabbitService.downloadScanReport(this.result)
      .subscribe(file => saveAs(file, `${this.reportName}.xlsx`))
  }

  onUploadReport() {
    this.whiteRabbitService.downloadScanReport(this.result)
      .pipe(
        switchMap(blob => this.scanDataUploadService.uploadScanReport(
          blobToFile(blob, `${this.reportName}.xlsx`))
        )
      )
      .subscribe(() => this.close.emit())
  }

  onFinish(userId: string) {
    this.result = userId;
  }
}
