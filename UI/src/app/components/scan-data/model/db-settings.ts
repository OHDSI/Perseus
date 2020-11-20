import { ScanParams } from './scanParams';

export interface DbSettings {
  dbType: string;
  user: string;
  password: string;
  database: string;
  server: string;
  domain?: string;
  tablesToScan?: string;
  scanParameters?: ScanParams;
}
