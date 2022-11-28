/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: Omit<ScanRequest, 'id'>, schemaOptions: { title: 'NewScanRequest', exclude: [ 'id' ] })
 */
export interface NewScanRequest {
  dataSourceConfig: {
'connector': 'databricks' | 'postgresql';
'token'?: string;
'host': string;
'path': string;
};
  scanParameters?: {
};
}
