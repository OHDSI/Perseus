import { CONCEPT_TABLES } from './concept-tables'
import { AuthStrategies } from './auth-strategies'

export const environment = {
  production: true,
  serverUrl: "/perseus",
  conceptTables: CONCEPT_TABLES,
  authStrategy: AuthStrategies.SMTP
};
