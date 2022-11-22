import { Injectable } from '@angular/core';
import { DbTypes } from '@app/scan-data/scan-data.constants';
import { ScanRequestControllerService } from './api/services/scan-request-controller.service';
import { DataConnection } from './data-connection';
import { DatabricksSettingsComponent } from './databricks/databricks-settings.component';
import { Loopback } from './loopback';

interface DataConnectionIndex {
  [key: string]: DataConnection
}

@Injectable()
export class DataConnectionService {

  dataConnectionIndex: DataConnectionIndex

  constructor(scanRequestControllerService: ScanRequestControllerService) {
    this.dataConnectionIndex = {
      [DbTypes.DATABRICKS]: new Loopback(
        'databricks',
        DatabricksSettingsComponent,
        scanRequestControllerService
      ),
    };
  }

  getDataConnection(dbType: string): DataConnection {
    return this.dataConnectionIndex[dbType]
  }
}