import { InjectionToken } from '@angular/core';
import { SqlFunction } from '../transformation-input/model/sql-string-functions';

export const SqlFunctionsInjector = new InjectionToken<Array<SqlFunction>>(
  'SQL_FUCTIONS'
);
