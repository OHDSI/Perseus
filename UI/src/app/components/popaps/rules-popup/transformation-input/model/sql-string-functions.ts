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
  maxNumberOfParameters?: number;
}

export class SqlFunction {
  get valueIndex(): number {
    return this.parameters.findIndex(pramName => pramName === 'value');
  }

  name: string;
  parameters: Array<string>;
  displayParameters: Array<string>;
  maxNumberOfParameters: number;
  hint?: string;

  constructor(opt: SqlFunctionDefinition = {}) {
    this.name = opt.name || '';
    this.parameters = opt.parameters || [];
    this.hint = opt.hint || '';
    this.maxNumberOfParameters =
      opt.maxNumberOfParameters || this.parameters.length;

    this.displayParameters = [...this.parameters];
  }

  getTemplate(columnName?: string) {
    const functionName = this.name;

    if (columnName && this.valueIndex > -1) {
      this.displayParameters[this.valueIndex] = columnName;
    }

    const parameters =
      this.displayParameters.length > 0
        ? `('${this.displayParameters.join('\', \'')}')`
        : '';
    return `${functionName}${parameters}`;
  }

  getSql(value: any) {
    const valuePlaceholderIndex = this.parameters.findIndex(
      parameterName => parameterName === 'value'
    );

    if (valuePlaceholderIndex > -1) {
      this.parameters[valuePlaceholderIndex] = value;
    }
    return `${this.name}(${this.parameters.join('\', \'')})`;
  }
}

export const SQL_FUNCTIONS: Array<SqlFunctionDefinition> = [
  new SqlFunction({
    name: 'REPLACE',
    parameters: ['value', 'old_string', 'new_string']
  }),
  new SqlFunction({
    name: 'UPPER',
    parameters: ['value']
  }),
  new SqlFunction({
    name: 'LOWER',
    parameters: ['value']
  }),
  new SqlFunction({
    name: 'CAST',
    parameters: ['value', 'datatype'],
    hint: 'AS'
  }), // AS int
  new SqlFunction({ name: 'DATEPART', parameters: ['interval', 'value'] }),
  new SqlFunction({
    name: 'DATEADD',
    parameters: ['interval', 'number', 'value']
  }),
  new SqlFunction({ name: 'ISNULL', parameters: ['expression', 'value'] }),
  new SqlFunction({
    name: 'SUBSTRING',
    parameters: ['value', 'start', 'length']
  }),
  new SqlFunction({ name: 'LTRIM', parameters: ['value'] }),
  new SqlFunction({ name: 'RTRIM', parameters: ['value'] }),
  new SqlFunction({ name: 'FLOOR', parameters: ['value'] }),
  new SqlFunction({
    name: 'ROUND',
    parameters: ['value', 'decimals', 'operation']
  }),
  new SqlFunction({ name: 'ABS', parameters: ['value'] }),
  new SqlFunction({ name: 'RIGHT', parameters: ['value', 'number_of_chars'] }),
  new SqlFunction({ name: 'LEFT', parameters: ['value', 'number_of_chars'] }),

  new SqlFunction({
    name: 'COALESCE',
    parameters: ['value'],
    maxNumberOfParameters: Number.POSITIVE_INFINITY
  }),
  new SqlFunction({
    name: 'CONCAT',
    parameters: ['value'],
    maxNumberOfParameters: Number.POSITIVE_INFINITY
  })
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
