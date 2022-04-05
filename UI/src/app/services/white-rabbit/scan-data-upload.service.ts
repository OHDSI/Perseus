import { Injectable } from '@angular/core';
import { BridgeService } from '../bridge.service';
import { DataService } from '../data.service';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PerseusApiService } from '@services/perseus/perseus-api.service'
import { ScanReportRequest } from '@models/perseus/scan-report-request'
import { Area } from '@models/area'

@Injectable()
export class ScanDataUploadService {
  constructor(private perseusApiService: PerseusApiService,
              private bridgeService: BridgeService,
              private dataService: DataService) {
  }

  uploadScanReport(scanReport: ScanReportRequest): Observable<void> {
    this.bridgeService.reportLoading();
    this.dataService.saveReportName(scanReport.fileName, 'report');

    return this.perseusApiService.createSourceSchemaByScanReport(scanReport)
      .pipe(
        switchMap(sourceTables => {
          this.bridgeService.resetAllMappings();
          this.dataService.prepareTables(sourceTables, Area.Source);
          this.bridgeService.saveAndLoadSchema$.next();
          return of(null);
        }),
        finalize(() => this.bridgeService.reportLoaded())
      )
  }
}
