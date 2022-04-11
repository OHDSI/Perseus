import { Injectable } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PerseusApiService } from '@services/perseus/perseus-api.service'
import { ScanReportRequest } from '@models/perseus/scan-report-request'
import { UploadScanReportResponse } from '@models/perseus/upload-scan-report-response'
import { Area } from '@models/area'
import { BridgeService } from '../bridge.service';
import { DataService } from '../data.service';
import { StoreService } from '../store.service';

@Injectable()
export class ScanDataUploadService {
  constructor(private perseusApiService: PerseusApiService,
              private bridgeService: BridgeService,
              private dataService: DataService,
              private storeService: StoreService) {}

  uploadScanReport(scanReportRequest: ScanReportRequest): Observable<UploadScanReportResponse> {
    this.bridgeService.reportLoading();

    return this.perseusApiService.createSourceSchemaByScanReport(scanReportRequest)
      .pipe(
        tap(res => {
          this.bridgeService.resetAllMappings();
          this.storeService.addEtlMapping(res.etl_mapping)
          this.dataService.prepareTables(res.source_tables, Area.Source);
          this.bridgeService.saveAndLoadSchema$.next();
        }),
        finalize(() => this.bridgeService.reportLoaded())
      )
  }
}
