/* tslint:disable */
/* eslint-disable */
export interface ScanRequest {
  dataSourceConfig: {
'connector': 'databricks' | 'postgresql';
'token': string;
'host': string;
'path': string;
};
  id?: number;
  scanParameters?: {
};
}
