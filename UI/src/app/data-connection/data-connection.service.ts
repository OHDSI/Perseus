import { Injectable } from '@angular/core';
import { DbTypes } from '@app/scan-data/scan-data.constants';
import { ScanRequest, ScanRequestLog } from './api/models';
import { DataConnection } from './data-connection';
import { DatabricksSettingsComponent } from './databricks/databricks-settings.component';
import { DatabricksTablesToScanComponent } from './databricks/databricks-tables-to-scan.component';

interface DataConnectionIndex {
  [key: string]: DataConnection
}

@Injectable()
export class DataConnectionService {

  dataConnectionIndex: DataConnectionIndex = {
    [DbTypes.DATABRICKS]: {
      settingsComponent: DatabricksSettingsComponent,
      tablesToScanComponent: DatabricksTablesToScanComponent,
    },
  }

  sourceConnection: DataConnection

  scanLogs: {[key: number]: {
    scanRequest: ScanRequest,
    logs: ScanRequestLog[]}
  } = {}

  lastModelDefRequest: ScanRequest
  lastProfileRequest: ScanRequest
  currentProfileRequest: ScanRequest

  get logsForLastModelDefRequest() {
    return this.scanLogs[this.lastModelDefRequest.id].logs
  }

  get logsForLastProfileRequest() {
    return this.scanLogs[this.lastProfileRequest.id].logs
  }

  get validProfileRequest(): boolean {
    return Boolean(this.currentProfileRequest?.scanParameters?.modelDefinitions?.length > 0)
  }

}