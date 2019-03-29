import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  private API_PATH = 'http://127.0.0.1:3000';

  constructor(private httpClient: HttpClient) {}

  retrieveData() {
    return this.httpClient.get<any>(`${this.API_PATH}/data`);
  }
}