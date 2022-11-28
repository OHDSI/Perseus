import { DataConnectionSettingsComponent } from '@app/data-connection/data-connection-settings.component';
import { ScanDataParams } from './scan-data-params';

export interface ScanSettings {
  dbType?: string
  scanDataParams?: ScanDataParams
  dataConnectionComponent? : DataConnectionSettingsComponent
}
