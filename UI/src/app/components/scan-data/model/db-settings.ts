import { ScanParameters } from './scanParameters';

export interface DbSettings {
  dbType: string;
  user: string;
  password: string;
  database: string;
  server: string;
  domain?: string;
  tablesToScan?: string;
  scanParameters?: ScanParameters;
}
