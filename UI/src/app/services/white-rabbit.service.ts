import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionResult } from '../components/scan-data/model/connection-result';
import { DbSettings } from '../components/scan-data/model/db-settings';
import { HttpClient } from '@angular/common/http';
import { whiteRabbitServiceUrl } from '../app.constants';
import { TableToScan } from '../components/scan-data/model/table-to-scan';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WhiteRabbitService {

  constructor(private http: HttpClient) {
  }

  testConnection(dbSettings: DbSettings): Observable<ConnectionResult> {
    return this.http.post<ConnectionResult>(`${whiteRabbitServiceUrl}/test-connection`, dbSettings);
  }

  tablesInfo(dbSettings: DbSettings): Observable<TableToScan[]> {
    return this.http.post<{tableNames: string[]}>(`${whiteRabbitServiceUrl}/tables-info`, dbSettings)
      .pipe(
        map(tablesInfo => tablesInfo.tableNames.map(tableName => ({
          tableName,
          selected: true
        })))
      );
  }
}
