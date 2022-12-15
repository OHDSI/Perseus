/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: ScanRequestLogWithRelations, schemaOptions: { includeRelations: true })
 */
export interface ScanRequestLogWithRelations {
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
'propertyProfiles'?: Array<{
'frequencyDistribution': Array<{
'bucketName': string;
'bucketCount': number;
}>;
'distinctValues': number;
'databricks'?: {
'col_name'?: string;
};
}>;
'settings': {
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
