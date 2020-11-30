import { ScanParams } from './scan-params';
import { TableToScan } from './table-to-scan';

export class DbSettingsBuilder {
  private dbSettings: DbSettings;
  private scanParams: ScanParams;
  private tablesToScan: TableToScan[];

  setDbSettings(dbSettings: DbSettings) {
    this.dbSettings = dbSettings;
    return this;
  }

  setScanParams(scanParams: ScanParams) {
    this.scanParams = scanParams;
    return this;
  }

  setTablesToScan(tablesToScan: TableToScan[]) {
    this.tablesToScan = tablesToScan;
    return this;
  }

  build(): DbSettings {
    const result: DbSettings = Object.assign({}, this.dbSettings);
    const filteredTables = this.tablesToScan
      .filter(table => table.selected);
    result.scanParams = Object.assign({}, this.scanParams);
    result.tablesToScanCount = filteredTables.length;
    result.tablesToScan = filteredTables
      .map(table => table.tableName)
      .join(',');

    return result;
  }
}

export interface DbSettings {
  dbType: string;
  user: string;
  password: string;
  database: string;
  server: string;
  domain?: string;
  tablesToScanCount?: number;
  tablesToScan?: string;
  scanParams?: ScanParams;
}
