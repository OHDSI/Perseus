import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { HttpService } from './http.service';

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
    this.uploadSchema(files).subscribe(res => {
      this.snackbar.open(
        'Success file upload',
        ' DISMISS ',
        {duration: 3000}
      );
      this.bridgeService.resetAllMappings();
      this.dataService.prepareTables(res, 'source');
      this.bridgeService.saveAndLoadSchema$.next();
    });
  }

  onFileInputClick(el: ElementRef) {
    if (el.nativeElement.files && el.nativeElement.files.length > 0) {
      el.nativeElement.value = '';
    }
    el.nativeElement.click();
  }
}
