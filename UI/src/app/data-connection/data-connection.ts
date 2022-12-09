import { Type } from '@angular/core';
import { Conversion } from '@app/models/conversion/conversion';
import { ColumnInfo } from '@app/models/perseus/column-info';
import { UploadScanReportResponse } from '@app/models/perseus/upload-scan-report-response';
import { ConnectionResultWithTables } from '@app/models/white-rabbit/connection-result';
import { Observable } from 'rxjs';
import { DataConnectionScanParamsComponent } from './data-connection-scan-params.component';
import { DataConnectionSettingsComponent } from './data-connection-settings.component';
import { DataConnectionTablesToScanComponent } from './data-connection-tables-to-scan.component';

export interface DataConnection {

  settingsComponent: Type<DataConnectionSettingsComponent>
  tablesToScanComponent: Type<DataConnectionTablesToScanComponent>
  scanParamsComponent: Type<DataConnectionScanParamsComponent>

  // Evaluates whether a profile can be executed
  // given the current user input for a data source.
  get validProfileRequest(): boolean

  // API Adapter for backwards compatability.
  // Called after entering connection settings
  // and before selecting tables to profile.
  testConnection(connectionSettings?: any): Observable<ConnectionResultWithTables>

  // API Adapter for backwards compatability.
  // Called after selecting tables to profile
  // to initialize the scan.
  generateScanReport(): Observable<Conversion>

  // API Adapter for backwards compatability.
  // Called to get updates on the profile scan.
  conversionInfoWithLogs(): Observable<Conversion>

  // API Adapter for backwards compatability.
  // Called to get the profile results.
  createSourceSchemaByScanReport(): Observable<UploadScanReportResponse>

  // API Adapter for backwards compatability.
  // Called to visualize columns stats in the "link tables" visualization.
  getColumnInfo(tableName: string, columnName: string): ColumnInfo
}