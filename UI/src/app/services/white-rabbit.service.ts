import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionResult } from '../scan-data/model/connection-result';
import { DbSettings } from '../scan-data/model/db-settings';
import { HttpClient } from '@angular/common/http';
import { whiteRabbitApiUrl } from '../app.constants';
import { TableToScan } from '../scan-data/model/table-to-scan';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WhiteRabbitService {

  constructor(private http: HttpClient) {
  }

  testConnection(dbSettings: DbSettings): Observable<ConnectionResult> {
    return this.http.post<ConnectionResult>(`${whiteRabbitApiUrl}/test-connection`, dbSettings);
  }

  tablesInfo(dbSettings: DbSettings): Observable<TableToScan[]> {
    return this.http.post<{tableNames: string[]}>(`${whiteRabbitApiUrl}/tables-info`, dbSettings)
      .pipe(
        map(tablesInfo => tablesInfo.tableNames.map(tableName => ({
          tableName,
          selected: true
        })))
      );
  }
}
