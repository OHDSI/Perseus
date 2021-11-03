import { getGlobalEnv } from './environment.util';
import { CONCEPT_TABLES } from './concept-tables';

const globalEnv = getGlobalEnv()

export const environment = {
  production: false,
  local: false,
  server: globalEnv?.server,
  dbServer: globalEnv?.dbServer,
  port: 8080,
  conceptTables: CONCEPT_TABLES
};
