import { Type } from "@angular/core"
import { Conversion } from "@app/models/conversion/conversion"
import { ConversionStatus } from "@app/models/conversion/conversion-status"
import { UploadScanReportResponse } from "@app/models/perseus/upload-scan-report-response"
import { ProgressLogStatus } from "@app/models/progress-console/progress-log-status"
import { ConnectionResultWithTables } from "@app/models/white-rabbit/connection-result"
import { EMPTY, Observable, of } from "rxjs"
import { delay, expand, map, reduce, switchMap } from "rxjs/operators"
import { NewScanRequest, ScanRequest, ScanRequestLog } from "./api/models"
import { ScanRequestControllerService, ScanRequestLogControllerService } from "./api/services"
import { DataConnection } from "./data-connection"
import { DataConnectionScanParamsComponent } from "./data-connection-scan-params.component"
import { LoopbackDataConnectionSettingsComponent } from "./data-connection-settings.component"
import { DataConnectionTablesToScanComponent } from "./data-connection-tables-to-scan.component"

export class Loopback implements DataConnection {

  scanLogs: {[key: number]: {
    scanRequest: ScanRequest,
    logs: ScanRequestLog[]}
  } = {}

  lastModelDefRequest: ScanRequest
  lastProfileRequest: ScanRequest
  currentProfileRequest: ScanRequest

  constructor(
    public settingsComponent: Type<LoopbackDataConnectionSettingsComponent>,
    public tablesToScanComponent: Type<DataConnectionTablesToScanComponent>,
    public scanParamsComponent: Type<DataConnectionScanParamsComponent>,
    private scanRequestControllerService: ScanRequestControllerService,
    private scanRequestLogControllerService: ScanRequestLogControllerService,
  ) {}

  get logsForLastModelDefRequest() {
    return this.scanLogs[this.lastModelDefRequest.id].logs
  }

  get logsForLastProfileRequest() {
    return this.scanLogs[this.lastProfileRequest.id].logs
  }

  get validProfileRequest(): boolean {
    return Boolean(this.currentProfileRequest?.scanParameters?.modelDefinitions?.length > 0)
  }

  testConnection(dataSourceConfig: NewScanRequest['dataSourceConfig']): Observable<ConnectionResultWithTables> {
    // TODO: reference child component INSTANCE
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
        if (this.scanLogs[s.id]) {
          this.scanLogs[s.id].logs.push(...l)
        } else { // first page
          this.lastModelDefRequest = s
          this.scanLogs[s.id] = {
            scanRequest: s,
            logs: l
          }
          // Deep copy of completed modelDef request to initialize profile request.
          this.currentProfileRequest = JSON.parse(JSON.stringify(s))
          delete this.currentProfileRequest['id']
          this.currentProfileRequest.scanParameters.profile = true
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

  generateScanReport(): Observable<Conversion> {
    // Return a dummy object for backwards compatability.
    return of({
      id: 0,
      project: 'project',
      statusCode: ConversionStatus.IN_PROGRESS,
      statusName: 'statusName',
      logs: []
    })
  }

  conversionInfoWithLogs(): Observable<Conversion> {
    // Progress not yet implemented. It will likely be easier to refactor
    // the progress dialog. 
    // Instead, we initialize and wait until the profile is complete to return the legacy obj.
    // Logs are stored in the service for out purposes.
    const profilePages = this.scanRequestControllerService.create({body: this.currentProfileRequest})
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
    profilePages.subscribe({
      next: ([s, l]: [ScanRequest, ScanRequestLog[]]) => {
        if (this.scanLogs[s.id]) {
          this.scanLogs[s.id].logs.push(...l)
        } else { // first page
          this.lastProfileRequest = s
          this.scanLogs[s.id] = {
            scanRequest: s,
            logs: l
          }
        }
      }
    })
    return profilePages.pipe(
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

  createSourceSchemaByScanReport(): Observable<UploadScanReportResponse> {
    return of({
      etl_mapping: {
        id: 0,
        username: 'username',
        source_schema_name: this.lastModelDefRequest.dataSourceConfig.host,
        cdm_version: 'cdm_version',
        scan_report_name: 'scan_report_name',
        scan_report_id: 0,
      },
      source_tables: this.logsForLastProfileRequest
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