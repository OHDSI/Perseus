import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

@Injectable()
export class UploadService {

  // mapping json loading
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private snackbar: MatSnackBar,
              private bridgeService: BridgeService,
              private perseusApiService: PerseusApiService,
              private dataService: DataService,
              private storeService: StoreService) {}

  get mappingLoading$() {
    return this.loading$.asObservable();
  }

  set mappingLoading(value: boolean) {
    this.loading$.next(value);
  }

  uploadScanReport(scanReportFile: File): Observable<UploadScanReportResponse> {
    this.bridgeService.reportLoading();
    return this.perseusApiService.uploadScanReport(scanReportFile, this.storeService.cdmVersion)
      .pipe(
        tap(res => {
          this.snackbar.open('Success file upload', ' DISMISS ');
          this.bridgeService.resetAllMappings();
          this.storeService.addEtlMapping(res.etl_mapping)
          this.dataService.prepareTables(res.source_tables, Area.Source);
          this.bridgeService.saveAndLoadSchema$.next();
        }),
        catchError(error => {
          const templateMessage = 'Failed to load report'
          const errorMessage = parseHttpError(error)
          throw new Error(
            errorMessage ? `${templateMessage}: ${errorMessage}` : templateMessage
          );
        }),
        finalize(() => this.bridgeService.reportLoaded())
      );
  }

  uploadEtlMapping(etlMappingArchiveFile: File): Observable<any> {
    this.mappingLoading = true;
    return this.perseusApiService.uploadEtlMapping(etlMappingArchiveFile)
      .pipe(
        tap(resp => {
          this.snackbar.open('Success file upload', ' DISMISS ');
          this.bridgeService.resetAllMappings();
          const configuration: EtlConfiguration = plainToConfiguration(resp.etl_configuration)
          this.bridgeService.applyConfiguration(configuration, resp.etl_mapping);
        }),
        finalize(() => this.mappingLoading = false)
      )
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }
}
