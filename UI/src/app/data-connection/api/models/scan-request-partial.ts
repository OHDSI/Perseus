/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: Partial<ScanRequest>, schemaOptions: { partial: true })
 */
export interface ScanRequestPartial {
  dataSourceConfig?: {
'connector': 'databricks' | 'postgresql';
'token': string;
'serverHostname': string;
'httpPath': string;
};
  id?: number;
  scanParameters?: {
};
}
