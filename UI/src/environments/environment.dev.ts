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
  production: false,
  url: 'http://10.110.1.7/dev/api',
  conceptTables: CONCEPT_TABLES,
  config: 'dev',
  whiteRabbitUrl: 'http://10.110.1.7'
};
