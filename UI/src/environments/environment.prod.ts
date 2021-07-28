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
  server: globalEnv?.server || '185.134.75.47',
  dbServer: globalEnv?.dbServer || '192.168.20.47',
  port: 80,
  conceptTables: CONCEPT_TABLES
};
