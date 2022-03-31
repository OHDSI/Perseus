import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { PerseusApiService } from './perseus/perseus-api.service';
import { EtlConfiguration } from '@models/etl-configuration';
import { StoreService } from './store.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import * as jsZip from 'jszip';
import { JSZipObject } from 'jszip';
import { MediaType } from '@utils/base64-util';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { parseHttpError } from '@utils/error';
import { jZipObjectToFile, readJsZipFile } from '@utils/jzip-util';
import { plainToConfiguration } from '@utils/configuration';

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

  uploadScanReportAndCreateSourceSchema(event: any): Observable<any> {
    const scanReportFile = event.target.files[0]
    this.bridgeService.reportLoading();
    this.storeService.add('reportFile', scanReportFile);
    return this.perseusApiService.uploadScanReportAndCreateSourceSchema(scanReportFile)
      .pipe(
        tap(res => {
          this.snackbar.open('Success file upload', ' DISMISS ');
          this.bridgeService.resetAllMappings();
          this.dataService.prepareTables(res, 'source');
          this.dataService.saveReportName(scanReportFile.name, 'report');
          this.bridgeService.saveAndLoadSchema$.next();
        }),
        catchError(error => {
          const templateMessage = 'Failed to load report'
          const errorMessage = parseHttpError(error)
          throw new Error(
            errorMessage ? `${templateMessage}: ${errorMessage}` : templateMessage
          );
        }),
        finalize(() =>
          this.bridgeService.reportLoaded()
        )
      );
  }

  uploadEtlMapping(event: any): Observable<any> {
    this.mappingLoading = true;
    return fromPromise(jsZip.loadAsync(event.target.files[0]))
      .pipe(
        switchMap(zip => {
          const fileNames = Object.keys(zip.files);
          if (fileNames.length === 0) {
            throw new Error('Empty archive')
          }
          return forkJoin(
            fileNames.map(key => {
              const dotIndex = key.lastIndexOf('.');
              const isJson = key.substring(dotIndex + 1) === 'json';
              return this.loadEtlMappingOrScanReport(zip.files[key], isJson as boolean)
            }))
        }),
        catchError(error => {
          const templateMessage = 'Failed to load mapping'
          const errorMessage = parseHttpError(error)
          throw new Error(
            errorMessage ? `${templateMessage}: ${errorMessage}` : templateMessage
          );
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

  private loadEtlMappingOrScanReport(zipObject: JSZipObject, isJson: boolean): Observable<any> {
    if (isJson) {
      return readJsZipFile(zipObject, 'string')
        .pipe(
          tap(content => {
            const configurationPlain = JSON.parse(content)
            const configuration = plainToConfiguration(configurationPlain)
            this.loadEtlMapping(configuration)
          })
        )
    } else {
      return jZipObjectToFile(zipObject, 'blob', MediaType.XLSX)
        .pipe(
          switchMap(file => this.loadScanReport(file))
        )
    }
  }

  private loadEtlMapping(configuration: EtlConfiguration) {
    this.bridgeService.applyConfiguration(configuration);
  }

  private loadScanReport(scanReportFile: File): Observable<any> {
    this.storeService.add('reportFile', scanReportFile);
    return this.perseusApiService.uploadScanReport(scanReportFile)
      .pipe(
        tap(() => this.snackbar.open('Success file upload', ' DISMISS '))
      )
  }
}
