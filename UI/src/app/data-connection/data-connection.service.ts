import { Injectable } from '@angular/core';
import { DbTypes } from '@app/scan-data/scan-data.constants';
import { DataConnection } from './data-connection';
import { DatabricksSettingsComponent } from './databricks/databricks-settings.component';

interface DataConnectionIndex {
  [key: string]: DataConnection
}

@Injectable()
export class DataConnectionService {

  dataConnectionIndex: DataConnectionIndex

  constructor() {
    this.dataConnectionIndex = {
      [DbTypes.DATABRICKS]: {
        settingsComponent: DatabricksSettingsComponent,
      },
    };
  }

}