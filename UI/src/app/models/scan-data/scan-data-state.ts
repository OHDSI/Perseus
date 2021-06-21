import { DbSettings } from '@models/scan-data/db-settings';
import { DelimitedTextFileSettings } from '@models/scan-data/delimited-text-file-settings';
import { ScanParams } from '@models/scan-data/scan-params';
import { TableToScan } from '@models/scan-data/table-to-scan';
import { ConnectionResult } from '@models/scan-data/connection-result';

export interface ScanDataState {
  dataType: string;
  dbSettings: DbSettings;
  fileSettings: DelimitedTextFileSettings;
  scanParams: ScanParams;
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
