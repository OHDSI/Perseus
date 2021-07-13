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

export const environment = {
  production: true,
  server: window['env']['server'] || '185.134.75.47',
  dbServer: window['env']['dbServer'] || '192.168.20.47',
  port: 80,
  conceptTables: CONCEPT_TABLES
};
