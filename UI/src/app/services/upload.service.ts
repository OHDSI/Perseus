import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { PerseusApiService } from './perseus/perseus-api.service';
import { Configuration } from '@models/configuration';
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

  constructor(
    private snackbar: MatSnackBar,
    private bridgeService: BridgeService,
    private httpService: PerseusApiService,
    private dataService: DataService,
    private storeService: StoreService
  ) {
  }

  get mappingLoading$() {
    return this.loading$.asObservable();
  }

  set mappingLoading(value: boolean) {
    this.loading$.next(value);
  }

  uploadSchema(files: File[], loadWithoutDb?: boolean): Observable<any> {
    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('file', file, file.name);
    }
    return loadWithoutDb ? this.httpService.loadReportToServer(formData) : this.httpService.postSaveLoadSchema(formData);
  }

  onScanReportChange(event: any): Observable<any> {
    const files = event.target.files;
    this.storeService.add('reportFile', files[0]);
    return this.uploadSchema(files)
      .pipe(
        tap(res => {
          this.snackbar.open(
            'Success file upload',
            ' DISMISS '
          );
          this.bridgeService.resetAllMappings();
          this.dataService.prepareTables(res, 'source');
          this.dataService.saveReportName(files[0].name, 'report');
          this.bridgeService.saveAndLoadSchema$.next();
        }),
        catchError(error => {
          this.bridgeService.reportLoading$.next(false)
          const templateMessage = 'Failed to load report'
          const errorMessage = parseHttpError(error)
          throw new Error(
            errorMessage ? `${templateMessage}: ${errorMessage}` : templateMessage
          );
        })
      );
  }

  onMappingChange(event: any): Observable<any> {
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
              return this.loadMappingAndReport(zip.files[key], isJson as boolean)
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

  loadMappingAndReport(zipObject: JSZipObject, isJson: boolean): Observable<any> {
    if (isJson) {
      return readJsZipFile(zipObject, 'string')
        .pipe(
          tap(content => {
            const configurationPlain = JSON.parse(content)
            const configuration = plainToConfiguration(configurationPlain)
            this.loadMapping(configuration)
          })
        )
    } else {
      return jZipObjectToFile(zipObject, 'blob', MediaType.XLSX)
        .pipe(
          switchMap(file => this.loadReport([file]))
        )
    }
  }

  loadMapping(configuration: Configuration) {
    this.bridgeService.applyConfiguration(configuration);
  }

  loadReport(files: File[]): Observable<any> {
    this.storeService.add('reportFile', files[0]);
    return this.uploadSchema(files, true)
      .pipe(
        tap(() => this.snackbar.open(
          'Success file upload',
          ' DISMISS '
        ))
      )
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }
}
