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
import { DataConnectionService } from '../data-connection.service';
import { DatabricksService } from './databricks.service';

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
  dataConnectionService: DataConnectionService
  scanRequestControllerService: ScanRequestControllerService
  scanRequestLogControllerService: ScanRequestLogControllerService
  profilePages: Observable<(number | ScanRequest | ScanRequestLog[])[]>

  public constructor(
    private formBuilder: FormBuilder,
    dataConnectionService: DataConnectionService,
    private databricksService: DatabricksService,
    scanRequestControllerService: ScanRequestControllerService,
    scanRequestLogControllerService: ScanRequestLogControllerService,
  ) {
    this.dataConnectionService = dataConnectionService
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

  // Called after entering connection settings
  // and before selecting tables to profile.
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
    // Keep logs in the service for our purposes,
    // return legacy object for backwards compatability.
    pages.subscribe({
      next: ([s, l]: [ScanRequest, ScanRequestLog[]]) => {
        if (this.databricksService.scanLogs[s.id]) {
          this.databricksService.scanLogs[s.id].logs.push(...l)
        } else { // first page
          this.databricksService.lastModelDefRequest = s
          this.databricksService.scanLogs[s.id] = {
            scanRequest: s,
            logs: l
          }
          // Deep copy of completed modelDef request to initialize profile request.
          this.databricksService.currentProfileRequest = JSON.parse(JSON.stringify(s))
          delete this.databricksService.currentProfileRequest['id']
          this.databricksService.currentProfileRequest.scanParameters.profile = true
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
            modelDefinition: t.modelDefinition,
          }))
        )
        return m
      }, {
        canConnect: true,
        tablesToScan: []
      }),
    )
  }

  // Called after selecting tables to profile
  // to initialize the scan.
  generateScanReport(): Observable<Conversion> {
    this.profilePages = this.scanRequestControllerService.create({body: this.databricksService.currentProfileRequest})
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
    // Return a dummy object for backwards compatability.
    return of({
      id: 0,
      project: 'project',
      statusCode: ConversionStatus.IN_PROGRESS,
      statusName: 'statusName',
      logs: []
    })
  }

  // Called to get updates on the profile scan.
  conversionInfoWithLogs(): Observable<Conversion> {
    // Progress not yet implemented. It will likely be easier to refactor
    // the progress dialog. 
    // Instead we wait until the profile is complete to return the legacy obj.
    // Logs are stored in the service for out purposes.
    this.profilePages.subscribe({
      next: ([s, l]: [ScanRequest, ScanRequestLog[]]) => {
        if (this.databricksService.scanLogs[s.id]) {
          this.databricksService.scanLogs[s.id].logs.push(...l)
        } else { // first page
          this.databricksService.lastProfileRequest = s
          this.databricksService.scanLogs[s.id] = {
            scanRequest: s,
            logs: l
          }
        }
      }
    })
    return this.profilePages.pipe(
      reduce((m, [_, l]: [ScanRequest, ScanRequestLog[]]) => {
        m.logs.push(
          ...l
          .map((t: ScanRequestLog) => {
            if (t.status === 'complete') {
              return {
                message: 'Profile of all models completed.',
                statusCode: ProgressLogStatus.INFO,
                statusName: 'INFO',
                percent: 100,
              }
            } else {
              const databricks = t.modelDefinition.settings.databricks
              return {
                message: `Completed profile of ${databricks.catalog}.${databricks.database}.${databricks.tableName}`,
                statusCode: ProgressLogStatus.INFO,
                statusName: 'INFO',
                percent: 50,
              }
            }
          })
        )
        return m
      }, {
        id: 0,
        project: 'project',
        statusCode: ConversionStatus.COMPLETED,
        statusName: 'statusName',
        logs: []
      })
    )
  }

  // Called to get the profile results.
  createSourceSchemaByScanReport(): Observable<UploadScanReportResponse> {
    return of({
      etl_mapping: {
        id: 0,
        username: 'username',
        source_schema_name: this.databricksService.lastModelDefRequest.dataSourceConfig.host,
        cdm_version: 'cdm_version',
        scan_report_name: 'scan_report_name',
        scan_report_id: 0,
      },
      source_tables: this.databricksService.logsForLastProfileRequest
        .filter(l => l.modelDefinition)
        .map(l => ({
          table_name: l.modelDefinition.settings.databricks.tableName,
          column_list: Object.values(l.modelDefinition.properties).map(p => ({
            column_name: p.databricks.col_name,
            column_type: p.databricks.data_type,
            is_column_nullable: 'true'
          }))
        }))
    })
  }
  
}
