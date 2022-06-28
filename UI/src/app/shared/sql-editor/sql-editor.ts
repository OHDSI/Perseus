import { ITable } from '@models/table'
import { AliasTableMapping } from '@shared/sql-editor/sql-editor.data'
import { IRow } from '@models/row'

export const JOIN_MAPPING = (context) => ['left join', 'right join', 'inner join', 'outer join']
export const SELECT_MAPPING = (context) => ['select * from']

export const selectTemplate = (text: string) => `select * from ${text} as t1`;

/**
 * Show hint: autocomplete column name by this.tableColumnsMapping
 */
export function onKeyUp(cm, event) {
  if (!cm.state.completionActive && event.code === 'Period') {
    cm.showHint({ completeSingle: false });
  }
}

/**
 * Prepare sql function before sending to back-end
 * Replace * (SELECT ALL) to field list with aliases if SQL query contains JOIN operator and same column in different tables
 * @param content - sql function from Text Editor
 * @param tables - source tables list
 * @return if JOIN query and same columns - parsed sql function with replaced * on fields list, else - content param
 */
export function addColumnAliasesIfNeeded(content: string, tables: ITable[]): string {
  const {tablesWithoutAlias, aliasTableMapping} = getTableAliasesInfo(content)
  throw Error('Not implemented')
}

/**
 * Legacy transferred from component, onChange method
 * @param sqlView - sql function from Text Editor
 * @return tables aliases info
 */
export function getTableAliasesInfo(sqlView: string): {
  tablesWithoutAlias: string[]
  aliasTableMapping: AliasTableMapping
} {
  const tablesWithoutAlias: string[] = []
  let aliasTableMapping: AliasTableMapping = {}
  const matches = sqlView
    .replace(/^(\r\n)|(\n)/gi, ' ')
    .replace(/\s\s+/g, ' ')
    .matchAll(/(from) (\w*)\b( as (\w*)\b)?| (join) (\w*)\b( as (\w*)\b)?/igm)

  if (matches) {
    aliasTableMapping = Array.from(matches).reduce((prev, cur) => {
      const isFrom = cur[ 1 ] && cur[ 1 ] === 'from';
      const isJoin = cur[ 5 ] && cur[ 5 ] === 'join';
      let aliasName;
      let tableName;
      if (isFrom) {
        tableName = cur[ 2 ];
        aliasName = cur[ 4 ];
      } else if (isJoin) {
        tableName = cur[ 6 ];
        aliasName = cur[ 8 ];
      }
      if (aliasName && tableName) {
        prev[ aliasName ] = tableName;
      }
      if (!aliasName && tableName) {
        tablesWithoutAlias.push(tableName)
      }
      return prev;
    }, {});
  }

  return {
    tablesWithoutAlias,
    aliasTableMapping
  }
}

/**
 * @return Postgres column to Postgres name: if name contains Upper case char than return name in double quotes
 */
export function mapToPostgresSqlName(row: IRow): string {
  return hasCapitalLetter(row.name) ? `"${row.name}"` : row.name
}

export function hasCapitalLetter(str) {
  return str.toLowerCase() !== str
}
