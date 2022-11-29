/* tslint:disable */
/* eslint-disable */
export interface ScanRequest {
  dataSourceConfig: {
'connector': 'databricks' | 'postgresql';
'token'?: string;
'host': string;
'path': string;
'port'?: number;
'protocol'?: string;
'profileNotebook'?: string;
};
  id?: number;
  scanParameters?: {
'profile': boolean;
'modelDefinitions'?: Array<{
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
}>;
};
}
