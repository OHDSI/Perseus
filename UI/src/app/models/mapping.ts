import { IComment } from './comment';

export interface MappingLookupSqlFiled {
  source_field: string;
  sql_field: string;
  sql_alias: string;
}

export interface MappingLookupField {
  key: string;
  defaultTypeId: string;
}

export interface MappingLookup {
  source_table: string;
  target_table: string;
  fields: Array<MappingLookupField>;
  lookup: string;
  sql_field: Array<MappingLookupSqlFiled>;
}

export interface MappingNode {
  source_field: string;
  target_field: string;
  sql_field: string;
  sql_alias: string;
  lookup?: string;
  lookupType?: string;
  sqlTransformation?: string;
  comments?: IComment[];
  condition?: string;
  targetCloneName?: string;
  groupName?: string;
}

export interface MappingPair {
  source_table: string;
  target_table: string;
  mapping: Array<MappingNode>;
  lookup?: Array<MappingLookup>;
  sqlTransformation?: string;
  clones?: {name: string, condition: string}[];
}

export interface Mapping {
  mapping_items: Array<MappingPair>;
  views?: object;
}






