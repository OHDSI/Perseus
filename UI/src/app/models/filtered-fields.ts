export interface FilteredFields {
  [targetTableName: string]: FilteredField
}

export interface FilteredField {
  checkedTypes: string[],
  items: string[],
  types: string[]
}
