import { InjectionToken } from '@angular/core';
import { SqlFunction } from '@models/transformation-input/sql-string-functions'

export const SqlFunctionsInjector = new InjectionToken<Array<SqlFunction>>(
  'SQL_FUCTIONS'
);
