import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { Configuration } from '../models/configuration';
import { StoreService } from './store.service';
import { BehaviorSubject } from 'rxjs';
import * as jsZip from 'jszip';
import { MediaType } from './utilites/base64-util';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  // mapping json loading
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private snackbar: MatSnackBar,
    private bridgeService: BridgeService,
    private httpService: HttpService,
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

  uploadSchema(files: File[], loadWithoutDb?: boolean) {
    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('file', file, file.name);
    }
    return loadWithoutDb ? this.httpService.loadReportToServer(formData) : this.httpService.postSaveLoadSchema(formData);
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    this.storeService.add('reportFile', files[0]);
    this.uploadSchema(files)
      .subscribe(res => {
        this.snackbar.open(
          'Success file upload',
          ' DISMISS '
        );
        this.bridgeService.resetAllMappings();
        this.dataService.prepareTables(res, 'source');
        this.dataService.saveReportName(files[0].name, 'report');
        this.bridgeService.saveAndLoadSchema$.next();
      }, () => this.bridgeService.reportLoading$.next(false));
  }


  async onMappingChange(event: any): Promise<any> {
    this.mappingLoading = true;
    const zip = await jsZip.loadAsync(event.target.files[ 0 ]);

    Object.keys(zip.files).forEach(obj => {
      const dotIndex = obj.lastIndexOf('.');
      const isJson = obj.substring(dotIndex + 1) === 'json';
      if (isJson) {
        this.loadMappingAndReport(zip.files[ obj ], true);
      } else {
        this.loadMappingAndReport(zip.files[ obj ], false);
      }
    })

  }

  async loadMappingAndReport(file: any, isJson: boolean) {
    if (isJson) {
      const content = await file.async('string');
      this.loadMapping(content);
    } else {
      const content = await file.async('blob');
      const blob = new Blob([content], { type: MediaType.XLSX });
      const reportFile = new File([blob], file.name, {type: MediaType.XLSX});
      this.loadReport([reportFile]);
    }
  }

  loadMapping(content: any) {
    const loadedConfig = JSON.parse(content as string);
    const resultConfig = new Configuration();
    Object.keys(loadedConfig).forEach(key => resultConfig[ key ] = loadedConfig[ key ]);
    this.bridgeService.applyConfiguration(resultConfig);
  }

  async loadReport(file: any) {
    this.storeService.add('reportFile', file[0]);
    this.uploadSchema(file, true)
      .subscribe(res => {
        this.snackbar.open(
          'Success file upload',
          ' DISMISS '
        );
      });
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }

}
