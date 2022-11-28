import { FormGroup } from "@angular/forms";
import { Conversion } from "@app/models/conversion/conversion";
import { UploadScanReportResponse } from "@app/models/perseus/upload-scan-report-response";
import { ConnectionResultWithTables } from "@app/models/white-rabbit/connection-result";
import { Observable } from "rxjs";

export interface DataConnectionSettingsComponent {
  form: FormGroup;

  testConnection(): Observable<ConnectionResultWithTables>
  generateScanReport(): Observable<Conversion>
  conversionInfoWithLogs(): Observable<Conversion>
  createSourceSchemaByScanReport(): Observable<UploadScanReportResponse>
}