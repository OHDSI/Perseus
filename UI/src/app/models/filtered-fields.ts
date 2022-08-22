export interface FilteredFields {
  [targetTableName: string]: {
    checkedTypes: string[],
    items: string[],
    types: string[]
  }
}
