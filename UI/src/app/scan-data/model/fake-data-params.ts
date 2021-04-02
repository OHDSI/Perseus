import { DbSettings } from './db-settings';

export interface FakeDataParams {
  maxRowCount: number;
  doUniformSampling: boolean;
  scanReportBase64?: string;
  dbSettings: DbSettings
}
