import { getGlobalEnv } from './environment.util';
import { CONCEPT_TABLES } from './concept-tables'

const globalEnv = getGlobalEnv()

export const environment = {
  production: true,
  local: false,
  server: globalEnv?.server || 'localhost',
  dbServer: globalEnv?.dbServer || 'localhost',
  port: 80,
  conceptTables: CONCEPT_TABLES
};
