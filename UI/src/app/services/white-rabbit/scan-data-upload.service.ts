import { Injectable } from '@angular/core';
import { filter, finalize, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PerseusApiService } from '@services/perseus/perseus-api.service'
import { UploadScanReportResponse } from '@models/perseus/upload-scan-report-response'
import { Area } from '@models/area'
import { BridgeService } from '../bridge.service';
import { DataService } from '../data.service';
import { StoreService } from '../store.service';
import { UploadService } from '@services/upload.service'
import { isSourceUploaded, isTablesMappedOrViewCreated } from '@utils/mapping-util'
import { CommonUtilsService } from '@services/common-utils.service'
import { ScanDataService } from '@services/white-rabbit/scan-data.service'

@Injectable()
export class ScanDataUploadService {
  constructor(private perseusApiService: PerseusApiService,
              private bridgeService: BridgeService,
              private dataService: DataService,
              private storeService: StoreService,
              private uploadService: UploadService,
              private commonUtilsService: CommonUtilsService,
              private whiteRabbitService: ScanDataService) {
  }

  uploadScanReport(conversionId: number): Observable<UploadScanReportResponse> {
    const state = this.storeService.state
    let before$: Observable<any>
    if (isSourceUploaded(state.source) && isTablesMappedOrViewCreated(state.targetConfig, state.source)) {
      const settings = {
        warning: 'All the changes in current mapping will be lost. Are you sure?',
        header: 'Link tables',
        okButton: 'Confirm',
        deleteButton: 'Cancel'
      }
      before$ = this.commonUtilsService.openWarningDialog(settings, {width: '298px', height: '234px'})
        .pipe(
          filter(result => result === settings.okButton)
        )
    } else {
      before$ = of(null)
    }

    return before$.pipe(
      switchMap(() => this.loadScanData(conversionId, state.etlMapping?.cdm_version)),
      tap(res => {
        this.commonUtilsService.resetMappingDataAndReturnToComfy()
        this.storeService.addEtlMapping(res.etl_mapping)
        this.dataService.prepareTables(res.source_tables, Area.Source)
      })
    )
  }

  private loadScanData(conversionId: number, cdmVersion?: string): Observable<UploadScanReportResponse> {
    this.uploadService.reportLoading = true
    return this.whiteRabbitService.result(conversionId).pipe(
      switchMap(scanReportReq =>
        this.perseusApiService.createSourceSchemaByScanReport({...scanReportReq, cdmVersion})
      ),
      finalize(() => this.uploadService.reportLoading = false)
    )
  }
}
