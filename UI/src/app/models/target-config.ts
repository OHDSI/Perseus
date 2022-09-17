export interface TargetConfig {
  [targetTableName: string]: TargetConfigItem
}

export interface TargetConfigItem {
  name: string, // Target table name
  first: string,
  data: string[] // Mapped source tables
}
