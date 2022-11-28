// import { Type } from '@angular/core';
// import { Conversion } from '@app/models/conversion/conversion';
// import { ConversionStatus } from '@app/models/conversion/conversion-status';
// import { ScanReportRequest } from '@app/models/perseus/scan-report-request';
// import { UploadScanReportResponse } from '@app/models/perseus/upload-scan-report-response';
// import { ProgressLogStatus } from '@app/models/progress-console/progress-log-status';
// import { ConnectionResultWithTables } from '@app/models/white-rabbit/connection-result';
// import { ScanSettings } from '@app/models/white-rabbit/scan-settings';
// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';
// // import { NewScanRequest } from './api/models';
// import { ScanRequestControllerService } from './api/services/scan-request-controller.service';
// import { DataConnection } from './data-connection';
// import { DataConnectionSettingsComponent } from './data-connection-settings.component';

// export class Loopback extends DataConnection {

//   // connector: NewScanRequest['dataSourceConfig']['connector']
//   settingsComponent: Type<DataConnectionSettingsComponent>

//   constructor(
//     // connector: NewScanRequest['dataSourceConfig']['connector'],
//     settingsComponent: Type<DataConnectionSettingsComponent>,
//     private scanRequestService: ScanRequestControllerService
//   ) {
//     super();
//     // this.connector = connector
//     this.settingsComponent = settingsComponent
//   }
  
//   generateScanReport(scanSettings: ScanSettings): Observable<Conversion> {
//     return of({
//       id: 0,
//       project: 'project',
//       statusCode: ConversionStatus.IN_PROGRESS,
//       statusName: 'statusName',
//       logs: []
//     })
//   }

//   conversionInfoWithLogs(conversionId: number): Observable<Conversion> {
//   //   return of({
//   //     id: 0,
//   //     project: 'project',
//   //     statusCode: ConversionStatus.IN_PROGRESS,
//   //     statusName: 'statusName',
//   //     logs: [{
//   //       message: 'Scan started.',
//   //       statusCode: ProgressLogStatus.INFO,
//   //       statusName: 'INFO',
//   //       percent: 50,
//   //     }]
//   //   })
//   // }
//     return of({
//       id: 0,
//       project: 'project',
//       statusCode: ConversionStatus.COMPLETED,
//       statusName: 'statusName',
//       logs: [{
//         message: 'Scan complete.',
//         statusCode: ProgressLogStatus.INFO,
//         statusName: 'INFO',
//         percent: 100,
//       }]
//     })
//   }

//   createSourceSchemaByScanReport(scanReport: ScanReportRequest): Observable<UploadScanReportResponse> {
//     return of({
//       etl_mapping: {
//         id: 0,
//         username: 'username',
//         source_schema_name: 'source_schema_name',
//         cdm_version: 'cdm_version',
//         scan_report_name: 'scan_report_name',
//         scan_report_id: 0,
//       },
//       source_tables: [
//         {
//           table_name: 'table_name',
//           column_list: [
//             {
//               column_name: 'column_name',
//               column_type: 'column_type',
//               is_column_nullable: 'false',
//             }
//           ]
//         }
//       ]
//     })
//   }
// }