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
  lookup: string;
}

export interface MappingPair {
  source_table: string;
  target_table: string;
  mapping: Array<MappingNode>;
  lookup?: Array<MappingLookup>;
}

export interface Mapping {
  mapping_items: Array<MappingPair>;
}






