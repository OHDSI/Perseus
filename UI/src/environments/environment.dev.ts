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
    url: 'http://127.0.0.1:5001/dev/api',
    conceptTables: CONCEPT_TABLES
};