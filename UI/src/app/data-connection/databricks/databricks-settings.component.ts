import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conversion } from '@app/models/conversion/conversion';
import { ConversionStatus } from '@app/models/conversion/conversion-status';
import { UploadScanReportResponse } from '@app/models/perseus/upload-scan-report-response';
import { ProgressLogStatus } from '@app/models/progress-console/progress-log-status';
import { ConnectionResultWithTables } from '@app/models/white-rabbit/connection-result';
import { EMPTY, Observable, of } from 'rxjs';
import { delay, expand, map, reduce, switchMap } from 'rxjs/operators';
import { NewScanRequest, ScanRequest, ScanRequestLog } from '../api/models';
import { ScanRequestControllerService, ScanRequestLogControllerService } from '../api/services';
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
  scanRequestLogControllerService: ScanRequestLogControllerService

  scanLogs: {[key: number]: {
    scanRequest: ScanRequest,
    logs: ScanRequestLog[]}
  } = {}
  lastScanRequest: ScanRequest

  public constructor(
    private formBuilder: FormBuilder,
    scanRequestControllerService: ScanRequestControllerService,
    scanRequestLogControllerService: ScanRequestLogControllerService,
  ) {
    this.scanRequestControllerService = scanRequestControllerService
    this.scanRequestLogControllerService = scanRequestLogControllerService
    this.form = this.formBuilder.group({
      host: [{value: null, disabled: false}, [Validators.required]],
      port: [{value: 443, disabled: false}, [Validators.required]],
      protocol: [{value: 'https', disabled: false}, [Validators.required]],
      path: [{value: null, disabled: false}, [Validators.required]],
      token: [{value: null, disabled: false}, []],
    });
  }

  testConnection(): Observable<ConnectionResultWithTables> {
    const dataSourceConfig: NewScanRequest['dataSourceConfig'] = {
      connector: this.connector,
      host: this.form.value.host,
      path: this.form.value.path,
    }
    if (this.form.value.token) {
      dataSourceConfig.token = this.form.value.token
    }
    const pages = this.scanRequestControllerService.create({body: {
      dataSourceConfig
    }})
    .pipe(
      switchMap((s: ScanRequest) => {
        return this.scanRequestLogControllerService.find({
          id: s.id
        }).pipe(map(l => [s, l, 0]))
      }),
      expand(([s, l, skip]: [ScanRequest, ScanRequestLog[], number]) => {
        if (l[l.length - 1]?.status === 'complete') {
          return EMPTY
        } else {
          return this.scanRequestLogControllerService.find({
            id: s.id,
            filter: {skip}
          }).pipe(map(l => [s, l, skip + l.length]), delay(1000))
        }
      })
    )
    // Keep logs in controller state for our purposes,
    // return legacy object for backwards compatability.
    pages.subscribe({
      next: ([s, l]: [ScanRequest, ScanRequestLog[]]) => {
        if (this.scanLogs[s.id]) {
          this.scanLogs[s.id].logs.push(...l)
        } else {
          this.lastScanRequest = s
          this.scanLogs[s.id] = {
            scanRequest: s,
            logs: l
          }
        }
      }
    })
    return pages.pipe(
      reduce((m, [_, l]: [ScanRequest, ScanRequestLog[]]) => {
        m.tablesToScan.push(
          ...l
          .filter((t: ScanRequestLog) => t.modelDefinition !== undefined)
          .map((t: ScanRequestLog) => ({
            tableName: t.modelDefinition.settings.databricks.tableName,
            selected: false,
            settings: t.modelDefinition.settings,
          }))
        )
        return m
      }, {
        canConnect: true,
        tablesToScan: []
      }),
    )
  }

  generateScanReport(): Observable<Conversion> {
    // We already have the columns, so we just return a dummy value.
    return of({
      id: 0,
      project: 'project',
      statusCode: ConversionStatus.IN_PROGRESS,
      statusName: 'statusName',
      logs: []
    })
  }

  conversionInfoWithLogs(): Observable<Conversion> {
    // We already have the columns, so we just return a dummy value.
    // "Conversion" object example kept here for documentation purposes.
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
        source_schema_name: this.lastScanRequest.dataSourceConfig.host,
        cdm_version: 'cdm_version',
        scan_report_name: 'scan_report_name',
        scan_report_id: 0,
      },
      source_tables: this.scanLogs[this.lastScanRequest.id].logs
        .filter((l: ScanRequestLog) => l.modelDefinition !== undefined)
        .map((l: ScanRequestLog) => ({
          table_name: l.modelDefinition.settings.databricks.tableName,
          column_list: Object.values(l.modelDefinition.properties).map(p => ({
            column_name: p.databricks.col_name,
            column_type: p.databricks.data_type,
            is_column_nullable: 'true',
          }))
        }))
    })
  }
  
}
