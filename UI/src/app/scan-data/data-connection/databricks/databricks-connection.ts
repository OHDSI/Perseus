import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { perseusApiUrl } from "@app/app.constants";
import { Conversion } from "@app/models/conversion/conversion";
import { ConversionStatus } from "@app/models/conversion/conversion-status";
import { ScanReportRequest } from "@app/models/perseus/scan-report-request";
import { UploadScanReportResponse } from "@app/models/perseus/upload-scan-report-response";
import { ProgressLogStatus } from "@app/models/progress-console/progress-log-status";
import { ConnectionResultWithTables } from "@app/models/white-rabbit/connection-result";
import { ScanSettings } from "@app/models/white-rabbit/scan-settings";
import { Observable, of } from "rxjs";
import { DataConnection } from "../data-connection";
import { DataConnectionSettingsComponent } from "../data-connection-settings.component";
import { DatabricksSettingsComponent } from "./databricks-settings.component";

export class DatabricksConnection extends DataConnection {

  settingsComponent: Type<DataConnectionSettingsComponent> = DatabricksSettingsComponent

  constructor(private http: HttpClient) {
    super();
  }

  testConnection(connectionSettings: ScanSettings): Observable<ConnectionResultWithTables> {
    return of({
      canConnect: true,
      tablesToScan: [
        {
          tableName: 'tableName',
          selected: false,
        }
      ]
    })
    return this.http.post<ConnectionResultWithTables>(`${perseusApiUrl}/data-connection/databricks/test-connection`, connectionSettings);
  }
  
  generateScanReport(scanSettings: ScanSettings): Observable<Conversion> {
    return of({
      id: 0,
      project: 'project',
      statusCode: ConversionStatus.IN_PROGRESS,
      statusName: 'statusName',
      logs: []
    })
  }

  conversionInfoWithLogs(conversionId: number): Observable<Conversion> {
  //   return of({
  //     id: 0,
  //     project: 'project',
  //     statusCode: ConversionStatus.IN_PROGRESS,
  //     statusName: 'statusName',
  //     logs: [{
  //       message: 'Scan started.',
  //       statusCode: ProgressLogStatus.INFO,
  //       statusName: 'INFO',
  //       percent: 50,
  //     }]
  //   })
  // }
    return of({
      id: 0,
      project: 'project',
      statusCode: ConversionStatus.COMPLETED,
      statusName: 'statusName',
      logs: [{
        message: 'Scan complete.',
        statusCode: ProgressLogStatus.INFO,
        statusName: 'INFO',
        percent: 100,
      }]
    })
  }

  createSourceSchemaByScanReport(scanReport: ScanReportRequest): Observable<UploadScanReportResponse> {
    return of({
      etl_mapping: {
        id: 0,
        username: 'username',
        source_schema_name: 'source_schema_name',
        cdm_version: 'cdm_version',
        scan_report_name: 'scan_report_name',
        scan_report_id: 0,
      },
      source_tables: [
        {
          table_name: 'table_name',
          column_list: [
            {
              column_name: 'column_name',
              column_type: 'column_type',
              is_column_nullable: 'false',
            }
          ]
        }
      ]
    })
  }
}