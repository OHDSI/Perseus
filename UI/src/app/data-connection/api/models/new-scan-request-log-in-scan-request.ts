/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: @loopback/repository-json-schema#Optional<Omit<ScanRequestLog, 'id'>, 'scanRequestId'>, schemaOptions: { title: 'NewScanRequestLogInScanRequest', exclude: [ 'id' ], optional: [ 'scanRequestId' ] })
 */
export interface NewScanRequestLogInScanRequest {
  modelDefinition?: {
'name'?: string;
'properties'?: {
[key: string]: {
'type'?: string;
'databricks'?: {
'col_name'?: string;
'data_type'?: string;
'comment'?: any;
};
};
};
'settings'?: {
'databricks'?: {
'catalog'?: string;
'database'?: string;
'tableName'?: string;
'isTemporary'?: boolean;
};
};
};
  modelProfile?: {
'rowCount': number;
'PropertyProfiles'?: Array<{
'frequencyDistribution': {
'bucketName': string;
'bucketCount': number;
};
'distinctValues': number;
'databricks'?: {
'col_name'?: string;
'data_type'?: string;
'comment'?: any;
};
}>;
};
  scanRequestId?: number;
  status: 'complete' | 'in progress';
}
