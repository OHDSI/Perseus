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
  server: window['env']['server'] ?? '10.110.1.7',
  dbServer: window['env']['dbServer'] ?? '10.110.1.7',
  port: 80,
  conceptTables: CONCEPT_TABLES
};
