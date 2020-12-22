import { Injectable } from '@angular/core';
import { UploadService } from './upload.service';
import { base64ToFileAsObservable } from './utilites/base64-util';
import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ScanDataUploadService {

  constructor(private uploadService: UploadService,
              private bridgeService: BridgeService,
              private dataService: DataService,
              private storeService: StoreService) {
  }

  uploadScanReport(reportBase64: string, reportName: string): Observable<void> {
    this.bridgeService.reportLoading();

    return base64ToFileAsObservable(reportBase64, `${reportName}.xlsx`)
      .pipe(
        switchMap(file => {
          this.storeService.add('reportFile', file);
          return this.uploadService.uploadSchema([file]);
        }),
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
