import { ScanParams } from './scan-params';
import { TableToScan } from './table-to-scan';
import { ScanSettings } from './scan-settings';

export interface DbSettings extends ScanSettings {
  dbType?: string;
  user: string;
  password: string;
  database: string;
  server: string;
  domain?: string;
  schema?: string;
  port?: number;
  itemsToScanCount?: number;
  tablesToScan?: string;
  scanParams?: ScanParams;
}

export class DbSettingsBuilder {
  private dbSettings: DbSettings;
  private scanParams: ScanParams;
  private tablesToScan: TableToScan[];
  private dbType: string;

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

  setDbType(dbType: string) {
    this.dbType = dbType;
    return this;
  }

  build(): DbSettings {
    const result: DbSettings = Object.assign({}, this.dbSettings);
    const filteredTables = this.tablesToScan
      .filter(table => table.selected);

    result.dbType = this.dbType;
    result.scanParams = this.scanParams;
    result.itemsToScanCount = filteredTables.length;
    result.tablesToScan = filteredTables
      .map(table => table.tableName)
      .join(',');

    return result;
  }
}
