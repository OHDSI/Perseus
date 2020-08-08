import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { Configuration } from '../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private snackbar: MatSnackBar,
    private bridgeService: BridgeService,
    private httpService: HttpService,
    private dataService: DataService
  ) {
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
    this.uploadSchema(files).subscribe(res => {
      this.snackbar.open(
        'Success file upload',
        ' DISMISS ',
        { duration: 3000 }
      );
      this.bridgeService.resetAllMappings();
      this.dataService.prepareTables(res, 'source');
      this.dataService.saveReportName(files[ 0 ].name.slice(0, dotPosition), 'report')
      this.bridgeService.saveAndLoadSchema$.next();
    });
  }

  onMappingChange(event: any): void {
    const file = event.target.files[ 0 ];
    const fileReader: FileReader = new FileReader();
    let content;
    const self = this;
    fileReader.onloadend = () => {
      content = fileReader.result;
      const loadedConfig = JSON.parse(content);
      const resultConfig = new Configuration();
      Object.keys(loadedConfig).forEach(key => resultConfig[key] = loadedConfig[key]);
      self.bridgeService.applyConfiguration(resultConfig);
    }
    fileReader.readAsText(file);
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }

}
