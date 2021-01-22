import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { Configuration } from '../models/configuration';
import { StoreService } from './store.service';
import { BehaviorSubject } from 'rxjs';

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

  uploadSchema(files: File[]) {
    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('file', file, file.name);
    }
    return this.httpService.postSaveLoadSchema(formData);
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    const dotPosition = files[ 0 ].name.lastIndexOf('.');
    this.storeService.add('reportFile', files[0]);
    this.uploadSchema(files)
      .subscribe(res => {
        this.snackbar.open(
          'Success file upload',
          ' DISMISS '
        );
        this.bridgeService.resetAllMappings();
        this.dataService.prepareTables(res, 'source');
        this.dataService.saveReportName(files[0].name.slice(0, dotPosition), 'report');
        this.bridgeService.saveAndLoadSchema$.next();
      }, () => this.bridgeService.reportLoading$.next(false));
  }

  onMappingChange(event: any): void {
    this.mappingLoading = true;
    const file = event.target.files[ 0 ];
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const content = fileReader.result;
        const loadedConfig = JSON.parse(content as string);
        const resultConfig = new Configuration();
        Object.keys(loadedConfig).forEach(key => resultConfig[key] = loadedConfig[key]);
        this.bridgeService.applyConfiguration(resultConfig);
      } catch (error) {
        this.mappingLoading = false;
      }
    };
    fileReader.onerror = () => {
      this.mappingLoading = false;
    };

    fileReader.readAsText(file);
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }

}
