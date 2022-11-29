/* tslint:disable */
/* eslint-disable */
import { ScanRequestLogWithRelations } from './scan-request-log-with-relations';

/**
 * (tsType: ScanRequestWithRelations, schemaOptions: { includeRelations: true })
 */
export interface ScanRequestWithRelations {
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
  logs?: Array<ScanRequestLogWithRelations>;
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
