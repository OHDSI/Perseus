import { getGlobalEnv } from './environment.util';

const CONCEPT_TABLES = [
  'CONCEPT',
  'COMMON',
  'CONDITION_OCCURRENCE',
  'DEVICE_EXPOSURE',
  'DRUG_EXPOSURE',
  'MEASUREMENT',
  'OBSERVATION',
  'PROCEDURE_OCCURRENCE',
  'SPECIMEN'
];

const globalEnv = getGlobalEnv()

export const environment = {
  production: false,
  local: true,
  server: globalEnv?.server || '10.110.1.7',
  dbServer: globalEnv?.dbServer || '10.110.1.7',
  port: 8080,
  conceptTables: CONCEPT_TABLES
};
