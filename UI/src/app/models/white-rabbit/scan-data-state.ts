import { DbSettings } from '@models/white-rabbit/db-settings';
import { FilesSettings } from '@models/white-rabbit/files-settings';
import { ScanDataParams } from '@models/white-rabbit/scan-data-params';
import { TableToScan } from '@models/white-rabbit/table-to-scan';
import { ConnectionResult } from '@models/white-rabbit/connection-result';

export interface ScanDataState {
  dataType: string;
  dbSettings: DbSettings;
  fileSettings: FilesSettings;
  scanParams: ScanDataParams;
  tablesToScan: TableToScan[];
  filteredTablesToScan: TableToScan[];
  searchTableName: string
  filesToScan: File[];
  connectionResult: ConnectionResult;
}

export const initialState: ScanDataState = {
  dataType: null,
  dbSettings: {
    server: null,
    user: null,
    password: null,
    database: null,
    schema: null,
    port: null
  },
  fileSettings: {
    fileType: null,
    delimiter: ','
  },
  scanParams: {
    sampleSize: 100e3,
    scanValues: true,
    minCellCount: 5,
    maxValues: 1e3,
    calculateNumericStats: false,
    numericStatsSamplerSize: 100e3
  },
  tablesToScan: [],
  filteredTablesToScan: [],
  searchTableName: null,
  filesToScan: [],
  connectionResult: null
};
