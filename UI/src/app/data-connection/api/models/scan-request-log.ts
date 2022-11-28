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
'comment'?: string;
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
  scanRequestId: number;
  status: 'complete' | 'in progress';
}
