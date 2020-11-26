import { Injectable } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { base64ToFileAsObservable } from '../../util/base64-util';
import { BridgeService } from '../../services/bridge.service';
import { DataService } from '../../services/data.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanDataUploadService {

  constructor(private uploadService: UploadService,
              private bridgeService: BridgeService,
              private dataService: DataService) {
  }

  uploadScanReport(reportBase64: string, reportName: string): Observable<void> {
    this.bridgeService.reportLoading();

    return base64ToFileAsObservable(reportBase64, reportName)
      .pipe(
        switchMap(file => this.uploadService.uploadSchema([file])),
        switchMap(res => {
          this.bridgeService.resetAllMappings();
          this.dataService.prepareTables(res, 'source');
          this.dataService.saveReportName(reportName, 'report');
          this.bridgeService.saveAndLoadSchema$.next();
          return of(null);
        })
      );
  }
}
