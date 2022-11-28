/* tslint:disable */
/* eslint-disable */
import { ScanRequestLogWithRelations } from './scan-request-log-with-relations';

/**
 * (tsType: ScanRequestWithRelations, schemaOptions: { includeRelations: true })
 */
export interface ScanRequestWithRelations {
  dataSourceConfig: {
'connector': 'databricks' | 'postgresql';
'token': string;
'host': string;
'path': string;
};
  id?: number;
  logs?: Array<ScanRequestLogWithRelations>;
  scanParameters?: {
};
}
