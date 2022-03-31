import { Injectable } from '@angular/core';
import { BridgeService } from '../bridge.service';
import { DataService } from '../data.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StoreService } from '../store.service';
import { PerseusApiService } from '@services/perseus/perseus-api.service'

@Injectable()
export class ScanDataUploadService {
  constructor(private perseusApiService: PerseusApiService,
              private bridgeService: BridgeService,
              private dataService: DataService,
              private storeService: StoreService) {
  }

  uploadScanReport(report: File): Observable<void> {
    this.bridgeService.reportLoading();
    this.storeService.add('reportFile', report);
    this.dataService.saveReportName(report.name, 'report');

    return this.perseusApiService.uploadScanReportAndCreateSourceSchema(report)
      .pipe(
        switchMap(res => {
          this.bridgeService.resetAllMappings();
          this.dataService.prepareTables(res, 'source');
          this.bridgeService.saveAndLoadSchema$.next();
          return of(null);
        }),
        finalize(() => this.bridgeService.reportLoaded())
      )
  }
}
