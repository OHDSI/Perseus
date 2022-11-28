import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conversion } from '@app/models/conversion/conversion';
import { ConversionStatus } from '@app/models/conversion/conversion-status';
import { UploadScanReportResponse } from '@app/models/perseus/upload-scan-report-response';
import { ProgressLogStatus } from '@app/models/progress-console/progress-log-status';
import { ConnectionResultWithTables } from '@app/models/white-rabbit/connection-result';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewScanRequest } from '../api/models';
import { ScanRequestControllerService } from '../api/services';
import { DataConnectionSettingsComponent } from '../data-connection-settings.component';

@Component({
  templateUrl: './databricks-settings.component.html',
  styleUrls: [
    '../../scan-data/scan-data-dialog/scan-data-form/connect-form/connect-form.component.scss',
    '../../scan-data/styles/scan-data-form.scss',
    '../../scan-data/styles/scan-data-connect-form.scss'
  ]
})
export class DatabricksSettingsComponent implements DataConnectionSettingsComponent {

  form: FormGroup
  connector: NewScanRequest['dataSourceConfig']['connector'] = 'databricks'
  scanRequestControllerService: ScanRequestControllerService

  public constructor(
    private formBuilder: FormBuilder,
    scanRequestControllerService: ScanRequestControllerService
  ) {
    this.scanRequestControllerService = scanRequestControllerService
    this.form = this.formBuilder.group({
      host: [{value: null, disabled: false}, [Validators.required]],
      port: [{value: 443, disabled: false}, [Validators.required]],
      protocol: [{value: 'https', disabled: false}, [Validators.required]],
      path: [{value: null, disabled: false}, [Validators.required]],
      token: [{value: null, disabled: false}, []],
    });
  }

  testConnection(): Observable<ConnectionResultWithTables> {
    return this.scanRequestControllerService.create({body: {
      dataSourceConfig: {
        connector: this.connector,
        host: this.form.value.host,
        path: this.form.value.path,
        token: this.form.value.token,
      }
    }})
    .pipe(map((r) => {
      return {
        canConnect: true,
        tablesToScan: [
          {
            tableName: 'tableName',
            selected: false,
          }
        ]
      }
    }))
  }

  generateScanReport(): Observable<Conversion> {
    return of({
      id: 0,
      project: 'project',
      statusCode: ConversionStatus.IN_PROGRESS,
      statusName: 'statusName',
      logs: []
    })
  }

  conversionInfoWithLogs(): Observable<Conversion> {
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

  createSourceSchemaByScanReport(): Observable<UploadScanReportResponse> {
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
