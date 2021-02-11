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
  url: 'http://185.134.75.47/api',
  conceptTables: CONCEPT_TABLES,
  whiteRabbitUrl: 'http://185.134.75.47',
  cdmBuilderUrl: 'http://185.134.75.47',
  dqdUrl: 'http://185.134.75.47/dqd',
  dqdWsUrl: 'ws://185.134.75.47:8001/dqd/progress'
};
