import { ElementRef, Injectable } from '@angular/core';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { PerseusApiService } from './perseus/perseus-api.service';
import { EtlConfiguration } from '@models/etl-configuration';
import { StoreService } from './store.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { parseHttpError } from '@utils/error';
import { plainToConfiguration } from '@utils/etl-configuration-util';
import { Area } from '@models/area'
import { UploadScanReportResponse } from '@models/perseus/upload-scan-report-response'
import { UploadEtlMappingResponse } from '@models/perseus/upload-etl-mapping-response'
import { CommonUtilsService } from '@services/common-utils.service'

@Injectable()
export class UploadService {
  private loadReport$ = new BehaviorSubject<boolean>(false)
  private loadMapping$ = new BehaviorSubject<boolean>(false)

  constructor(private bridgeService: BridgeService,
              private perseusApiService: PerseusApiService,
              private dataService: DataService,
              private storeService: StoreService,
              private commonUtilsService: CommonUtilsService) {}

  get reportLoading$(): Observable<boolean> {
    return this.loadReport$.asObservable()
  }

  set reportLoading(value: boolean) {
    this.loadReport$.next(value)
  }

  get mappingLoading$(): Observable<boolean> {
    return this.loadMapping$.asObservable()
  }

  uploadScanReport(scanReportFile: File): Observable<UploadScanReportResponse> {
    this.loadReport$.next(true)
    return this.perseusApiService.uploadScanReport(scanReportFile, this.storeService.cdmVersion)
      .pipe(
        tap(res => {
          this.commonUtilsService.resetMappingDataAndReturnToComfy()
          this.storeService.addEtlMapping(res.etl_mapping)
          this.dataService.prepareTables(res.source_tables, Area.Source)
        }),
        catchError(error => {
          const templateMessage = 'Failed to load report'
          const errorMessage = parseHttpError(error)
          throw new Error(
            errorMessage ? `${templateMessage}: ${errorMessage}` : templateMessage
          );
        }),
        finalize(() => this.loadReport$.next(false))
      );
  }

  uploadEtlMapping(etlMappingArchiveFile: File): Observable<UploadEtlMappingResponse> {
    this.loadMapping$.next(true)
    return this.perseusApiService.uploadEtlMapping(etlMappingArchiveFile)
      .pipe(
        tap(resp => {
          this.commonUtilsService.resetMappingDataAndReturnToComfy()
          const configuration: EtlConfiguration = plainToConfiguration(resp.etl_configuration)
          this.bridgeService.applyConfiguration(configuration, resp.etl_mapping)
        }),
        finalize(() => this.loadMapping$.next(false))
      )
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }
}
