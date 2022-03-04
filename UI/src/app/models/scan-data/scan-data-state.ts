import { DbSettings } from '@models/scan-data/db-settings';
import { FilesSettings } from '@models/scan-data/files-settings';
import { ScanDataParams } from '@models/scan-data/scan-data-params';
import { TableToScan } from '@models/scan-data/table-to-scan';
import { ConnectionResult } from '@models/scan-data/connection-result';
import { DbTypes } from '@scan-data/scan-data.constants'

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
  dataType: DbTypes.SQL_SERVER,
  dbSettings: {
    dbType: DbTypes.SQL_SERVER,
    server: '822JNJ16S03V',
    port: 1433,
    user: 'cdm_builder',
    password: 'builder1!',
    database: 'mdcd_native_test',
    schema: 'dbo'
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
