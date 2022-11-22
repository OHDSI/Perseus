/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: ScanRequestWithRelations, schemaOptions: { includeRelations: true })
 */
export interface ScanRequestWithRelations {
  dataSourceConfig: {
'connector': 'databricks' | 'postgresql';
'token': string;
'serverHostname': string;
'httpPath': string;
};
  id?: number;
  scanParameters?: {
};
}
