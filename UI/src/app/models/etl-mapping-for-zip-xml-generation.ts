import { IComment } from './comment';
import { Lookup } from '@models/perseus/lookup'

export interface MappingLookupSqlField {
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
  sql_field: Array<MappingLookupSqlField>;
}

export interface MappingNode {
  concept_id?: number;
  source_field: string;
  target_field: string;
  sql_field: string;
  sql_alias: string;
  lookup?: string | Lookup;
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

export interface EtlMappingForZipXmlGeneration {
  mapping_items: Array<MappingPair>;
  views?: object;
}






