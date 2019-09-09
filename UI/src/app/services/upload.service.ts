import { Injectable } from '@angular/core';

@Injectable()
export class UploadService {

  constructor() {}

  public putFileOnServer(method: string = 'POST', url: string, params: string[], files: File[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append('uploads[]', files[i], files[i].name);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.send(formData);
    });
  }
}
