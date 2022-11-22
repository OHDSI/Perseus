import { Type } from '@angular/core';
import { Conversion } from '@app/models/conversion/conversion';
import { ScanReportRequest } from '@app/models/perseus/scan-report-request';
import { UploadScanReportResponse } from '@app/models/perseus/upload-scan-report-response';
import { ConnectionResultWithTables } from '@app/models/white-rabbit/connection-result';
import { ScanSettings } from '@app/models/white-rabbit/scan-settings';
import { Observable } from 'rxjs';
import { DataConnectionSettingsComponent } from './data-connection-settings.component';

export abstract class DataConnection {

  abstract settingsComponent: Type<DataConnectionSettingsComponent>

  /* 
  Called after user configures settings in the
  "scan-data-dialog". Returns a list of tables
  a user can select from for scanning.
  */
  abstract testConnection(connectionSettings: ScanSettings): Observable<ConnectionResultWithTables>

  /*
  Initializes a query to create a "ScanReport"
  after a user selects the tables to be scanned
  in the "scan-data-dialog".
  */
  abstract generateScanReport(scanSettings: ScanSettings): Observable<Conversion>

  /*
  Called to get a status update after initializing
  a query for a "ScanReport".
  */
  abstract conversionInfoWithLogs(conversionId: number): Observable<Conversion>

  /*
  Fetches a complete scan report.
  */
  abstract createSourceSchemaByScanReport(scanReport: ScanReportRequest): Observable<UploadScanReportResponse>
}