import { ITable, ITableOptions, Table } from '@models/table'
import { AliasTableMapping, TablesAliasesInfo } from '@shared/sql-editor/sql-editor.data'
import { IRow, Row, RowOptions } from '@models/row'
import { ViewSqlResponse } from '@models/perseus/view-sql-response'
import { Area } from '@models/area'

export const JOIN_MAPPING = (context) => ['left join', 'right join', 'inner join', 'outer join']
export const SELECT_MAPPING = (context) => ['select * from']

export const selectTemplate = (text: string) => `select * from ${text} as t1`;

export function joinTemplate(tableName: string, sql: string): string {
  const joinCount = (sql.match(/join/gi) || []).length;
  return `${sql}
      join ${tableName} as t${joinCount + 2} on`;
}

export const SELECT_MATCHER = /select\b[ \n]*\*/gi

export const TABLE_ALIAS_MATCHER = {
  REGEX: /(join|from)\b( |\n)+"?(\w+)"?(( |\n)+(as)\b( |\n)+(\w+))?/gi,
  STR_INDEX: 0,
  OPERATOR_INDEX: 1,
  TABLE_NAME_INDEX: 3,
  ALIAS_NAME_INDEX: 8
}


/**
 * @param sql - sql function from Text Editor
 * @return tables aliases info
 * For example input: select * from test_data as t1 join patients on t1.id = patients.id
 * Result: {
 *    tablesWithoutAlias: ['patients']
 *    aliasTableMapping: {'test_data': 't1'}
 * }
 */
export function getTablesAliasesInfo(sql: string): TablesAliasesInfo {
  const tablesWithoutAlias: string[] = []
  const aliasTableMapping: AliasTableMapping = {}
  const matchesArray: string[][] = Array.from(sql.matchAll(TABLE_ALIAS_MATCHER.REGEX))

  if (matchesArray?.length) {
    for (const matches of matchesArray) {
      const {OPERATOR_INDEX, TABLE_NAME_INDEX, ALIAS_NAME_INDEX, STR_INDEX} = TABLE_ALIAS_MATCHER
      const operator = matches[OPERATOR_INDEX].toLowerCase()
      if (operator !== 'from' && operator !== 'join') {
        throw new Error(`Unexpected SQL operator: ${matches[STR_INDEX]}`)
      }
      const tableName = matches[TABLE_NAME_INDEX];
      const aliasName = matches[ALIAS_NAME_INDEX];
      if (aliasName && tableName) {
        aliasTableMapping[aliasName] = tableName;
      } else if (tableName) {
        tablesWithoutAlias.push(tableName)
      }
    }
  }

  return {
    tablesWithoutAlias,
    aliasTableMapping
  }
}

export function mapTableToPostgresSqlName(table: ITable): string {
  return mapToPostgresSqlName(table.name)
}

export function mapRowToPostgresSqlName(row: IRow): string {
  return mapToPostgresSqlName(row.name)
}

/**
 * @return Postgres name: if name contains Upper case char than return name in double quotes
 */
export function mapToPostgresSqlName(name: string): string {
  return hasCapitalLetter(name) ? `"${name}"` : name
}

export function hasCapitalLetter(str) {
  return str.toLowerCase() !== str
}

export function createTable(tableId: number,
                            tableName: string,
                            sql: string,
                            res: ViewSqlResponse[]): ITable {
  const viewResultColumns: IRow[] = [];
  res.forEach((row, index) => {
    const rowOptions: RowOptions = {
      id: index,
      tableId,
      tableName,
      name: row.name,
      type: row.type,
      isNullable: true,
      comments: [],
      uniqueIdentifier: false,
      area: Area.Source
    };
    viewResultColumns.push(new Row(rowOptions));
  });
  const settings: ITableOptions = {
    rows: viewResultColumns,
    area: Area.Source,
    id: tableId,
    name: tableName,
    sql
  };
  return new Table(settings);
}
