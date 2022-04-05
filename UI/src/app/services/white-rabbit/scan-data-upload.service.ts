import { Injectable } from '@angular/core';
import { BridgeService } from '../bridge.service';
import { DataService } from '../data.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PerseusApiService } from '@services/perseus/perseus-api.service'
import { ScanReport } from '@models/scan-report/scan-report'

@Injectable()
export class ScanDataUploadService {
  constructor(private perseusApiService: PerseusApiService,
              private bridgeService: BridgeService,
              private dataService: DataService) {
  }

  uploadScanReport(scanReport: ScanReport): Observable<void> {
    this.bridgeService.reportLoading();
    this.dataService.saveReportName(scanReport.fileName, 'report');

    return this.perseusApiService.createSourceSchemaByScanReport(scanReport)
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
