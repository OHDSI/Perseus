import { InjectionToken } from '@angular/core';
import { SqlFunction } from '@popups/rules-popup/transformation-input/model/sql-string-functions';

export const SqlFunctionsInjector = new InjectionToken<Array<SqlFunction>>(
  'SQL_FUCTIONS'
);
