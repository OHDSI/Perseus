/* tslint:disable */
/* eslint-disable */
export interface ScanRequest {
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
