import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from 'src/app/models/table';
import { Data } from 'src/app/models/data';

@Injectable()
export class DataService {
  private API_PATH = 'http://127.0.0.1:3000';

  constructor(private httpClient: HttpClient) {}

  retrieveData() {
    return this.httpClient.get<Data>(`${this.API_PATH}/data`);
  }
}