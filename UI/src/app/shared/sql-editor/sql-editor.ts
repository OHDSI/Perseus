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

export const selectMatcher = /select\b[ \n]*\*/gi

/**
 * Legacy transferred from component, onChange method
 * @param sqlView - sql function from Text Editor
 * @return tables aliases info
 */
export function getTablesAliasesInfo(sqlView: string): TablesAliasesInfo {
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
