/* tslint:disable */
/* eslint-disable */
export interface ScanRequestLog {
  id?: number;
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
  scanRequestId: number;
  status: 'complete' | 'in progress';
}
