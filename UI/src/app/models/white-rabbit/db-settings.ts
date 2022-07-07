import { ScanDataParams } from './scan-data-params';
import { TableToScan } from './table-to-scan';
import { ScanSettings } from './scan-settings';

export interface DbSettings extends ScanSettings {
  dbType?: string;
  user: string;
  password: string;
  database: string;
  server: string;
  schema?: string;
  port?: number;
  tablesToScan?: string;
  scanDataParams?: ScanDataParams;
}

export class DbSettingsBuilder {
  private dbSettings: DbSettings;
  private scanDataParams: ScanDataParams;
  private tablesToScan: TableToScan[];
  private dbType: string;

  setDbSettings(dbSettings: DbSettings) {
    this.dbSettings = dbSettings;
    return this;
  }

  setScanParams(scanParams: ScanDataParams) {
    this.scanDataParams = scanParams;
    return this;
  }

  setTablesToScan(tablesToScan: TableToScan[]) {
    this.tablesToScan = tablesToScan;
    return this;
  }

  setDbType(dbType: string) {
    this.dbType = dbType;
    return this;
  }

  build(): DbSettings {
    const result: DbSettings = {...this.dbSettings};
    const filteredTables = this.tablesToScan.filter(table => table.selected);
    result.dbType = this.dbType;
    result.scanDataParams = this.scanDataParams;
    result.tablesToScan = filteredTables
      .map(table => table.tableName)
      .join(',');

    return result;
  }
}
