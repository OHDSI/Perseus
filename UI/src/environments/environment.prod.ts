const CONCEPT_TABLES = [
  'SPECIAL',
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
  url: 'http://10.110.1.76:5000',
  conceptTables: CONCEPT_TABLES
};
