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
  url: 'http://10.110.1.7/api',
  conceptTables: CONCEPT_TABLES,
  config: '',
  whiteRabbitUrl: 'http://10.110.1.7',
  cdmBuilderUrl: 'http://10.110.1.7'
};
