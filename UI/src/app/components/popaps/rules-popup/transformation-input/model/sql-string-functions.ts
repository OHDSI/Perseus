// https://www.w3schools.com/sql/sql_ref_sqlserver.asp
// Monaco editor
// https://github.com/atularen/ngx-monaco-editor#readme

// https://codemirror.net/
// https://stackoverflow.com/questions/49154935/sql-viewer-editor-for-angular-cli

// * value - column data
// * delimeter always comma

export interface SqlFunctionDefinition {
  name?: string;
  parameters?: Array<string>;
  hint?: string;
}

export class SqlFunction {
  name: string;
  parameters: Array<string>;
  hint?: string;

  constructor(opt: SqlFunctionDefinition = {}) {
    this.name = opt.name || '';
    this.parameters = opt.parameters || [];
    this.hint = opt.hint || '';
  }

  getTemplate(columnName: string): string {
    const valuePlaceholderIndex = this.parameters.findIndex(
      pramName => pramName === 'value'
    );

    if (valuePlaceholderIndex > -1) {
      this.parameters[valuePlaceholderIndex] = columnName;
    }

    return `${this.name}('${this.parameters.join('\', \'')}')`;
  }
}

export const SQL_FUNCTIONS: Array<SqlFunctionDefinition> = [
  new SqlFunction({ name: 'REPLACE', parameters: ['value', 'old_string', 'new_string'] }),
  new SqlFunction({ name: 'UPPER', parameters: ['value'] }),
  new SqlFunction({ name: 'LOWER', parameters: ['value'] }),
  new SqlFunction({ name: 'CAST', parameters: ['value', 'datatype'], hint: 'AS' }), // AS int
  new SqlFunction({ name: 'DATEPART', parameters: ['interval', 'value'] }),
  new SqlFunction({ name: 'DATEADD', parameters: ['interval', 'number', 'value'] }),
  new SqlFunction({ name: 'ISNULL', parameters: ['expression', 'value'] }),
  new SqlFunction({ name: 'SUBSTRING', parameters: ['value', 'start', 'length'] }),
  new SqlFunction({ name: 'LTRIM', parameters: ['value'] }),
  new SqlFunction({ name: 'RTRIM', parameters: ['value'] }),
  new SqlFunction({ name: 'FLOOR', parameters: ['value'] }),
  new SqlFunction({ name: 'ROUND', parameters: ['value', 'decimals', 'operation'] }),
  new SqlFunction({ name: 'ABS', parameters: ['value'] }),
  new SqlFunction({ name: 'RIGHT', parameters: ['value', 'number_of_chars'] }),
  new SqlFunction({ name: 'LEFT', parameters: ['value', 'number_of_chars'] }),
  new SqlFunction({ name: 'COALESCE', parameters: ['value'] })
];

export const SQL_STRING_FUNCTIONS = [
  'ASCII',
  'CHAR',
  'CHARINDEX',
  'CONCAT',
  'CONCAT_WS',
  'DATALENGTH',
  'DIFFERENCE',
  'FORMAT',
  'LEFT',
  'LEN',
  'LOWER',
  'LTRIM',
  'NCHAR',
  'PATINDEX',
  'QUOTENAME',
  'REPLACE',
  'REPLICATE',
  'REVERSE',
  'RIGHT',
  'RTRIM',
  'SOUNDEX',
  'SPACE',
  'STR',
  'STUFF',
  'SUBSTRING',
  'TRANSLATE',
  'TRIM',
  'UNICODE',
  'UPPER'
];
