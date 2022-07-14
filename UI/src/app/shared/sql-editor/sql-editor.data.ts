import { ITable } from '@models/table'
import { IRow } from '@models/row'

export interface SqlEditorData {
  table?: ITable,
  tables: ITable[]
  action: 'Create' | 'Edit'
}

export type AliasTableMapping = {
  [alias: string]: ITable
} | {}

export type TablesColumnsMapping = {
  [tableName: string]: IRow
} | {}

export interface TablesAliasesInfo {
  tablesWithoutAlias: string[]
  aliasTableMapping: AliasTableMapping
}
