import { Type } from '@angular/core';
import { DataConnectionSettingsComponent } from './data-connection-settings.component';
import { DataConnectionTablesToScanComponent } from './data-connection-tables-to-scan.component';

export interface DataConnection {

  settingsComponent: Type<DataConnectionSettingsComponent>
  tablesToScanComponent: Type<DataConnectionTablesToScanComponent>

}