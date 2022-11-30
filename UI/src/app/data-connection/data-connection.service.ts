import { Injectable } from '@angular/core';
import { DbTypes } from '@app/scan-data/scan-data.constants';
import { DataConnection } from './data-connection';
import { DatabricksSettingsComponent } from './databricks/databricks-settings.component';
import { DatabricksTablesToScanComponent } from './databricks/databricks-tables-to-scan.component';
import { DatabricksScanParamsComponent } from './databricks/databricks-scan-params.component'

interface DataConnectionIndex {
  [key: string]: DataConnection
}

@Injectable()
export class DataConnectionService {

  dataConnectionIndex: DataConnectionIndex = {
    [DbTypes.DATABRICKS]: {
      settingsComponent: DatabricksSettingsComponent,
      tablesToScanComponent: DatabricksTablesToScanComponent,
      scanParamsComponent: DatabricksScanParamsComponent,
    },
  }

  sourceConnection: DataConnection

}