import { DbSettings } from './db-settings';

export interface FakeDataParams {
  maxRowCount: number;
  doUniformSampling: boolean;
  dbSettings: DbSettings
}
