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
  production: true,
  local: false,
  server: globalEnv?.server || 'localhost',
  dbServer: globalEnv?.dbServer || 'localhost',
  port: 80,
  conceptTables: CONCEPT_TABLES
};
