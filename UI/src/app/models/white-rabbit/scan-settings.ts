import { DataConnectionService } from '@app/data-connection/data-connection.service';
import { ScanDataParams } from './scan-data-params';

export interface ScanSettings {
  dbType?: string
  scanDataParams?: ScanDataParams
  dataConnectionService? : DataConnectionService
}
