import { Injectable } from '@angular/core';
import { DbTypes } from '@app/scan-data/scan-data.constants';
import { DataConnection } from './data-connection';
import { DatabricksSettingsComponent } from './databricks/databricks-settings.component';
import { DatabricksTablesToScanComponent } from './databricks/databricks-tables-to-scan.component';
import { DatabricksScanParamsComponent } from './databricks/databricks-scan-params.component'
import { Loopback } from './loopback'
import { ScanRequestControllerService, ScanRequestLogControllerService } from './api/services';

interface DataConnectionIndex {
  [key: string]: DataConnection
}

@Injectable()
export class DataConnectionService {

  constructor(
    private scanRequestControllerService: ScanRequestControllerService,
    private scanRequestLogControllerService: ScanRequestLogControllerService
  ) {}

  dataConnectionIndex: DataConnectionIndex = {
    [DbTypes.DATABRICKS]: new Loopback(
      DatabricksSettingsComponent,
      DatabricksTablesToScanComponent,
      DatabricksScanParamsComponent,
      this.scanRequestControllerService,
      this.scanRequestLogControllerService,
    )
  }

  sourceConnection: DataConnection

}