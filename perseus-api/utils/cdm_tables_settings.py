WITHIN_OBSERVATION_PERIOD_TYPES_TABLES = [
        'condition_occurrence',
        'device_exposure',
        'drug_exposure',
        'measurement',
        'note',
        'note_nlp',
        'observation',
        'procedure_occurrence',
        'specimen',
        'survey_conduct',
        'visit_detail',
        'visit_occurrence',
        'payer_plan_period',
        'drug_era',
        'dose_era',
        'condition_era',
]
WITHIN_OBSERVATION_DEFAULT_VALUES = {
    'condition_occurrence': False,
    'device_exposure': False,
    'drug_exposure': False,
    'measurement': False,
    'note': False,
    'note_nlp': False,
    'observation': False,
    'procedure_occurrence': False,
    'specimen': False,
    'survey_conduct': False,
    'visit_detail': False,
    'visit_occurrence': False,
    'payer_plan_period': False,
    'drug_era': False,
    'dose_era': False,
    'condition_era': False,
}

GAP_WINDOW_TABLES = ['observation_period', 'drug_era', 'dose_era', 'condition_era']
GAP_WINDOW_DEFAULT_VALUES = {
    'observation_period': 32,
    'drug_era': 30,
    'dose_era': 30,
    'condition_era': 30,
}

USE_VISIT_CONCEPT_ROLLUP_LOGIC_TABLES = ['visit_occurrence']
USE_VISIT_CONCEPT_ROLLUP_LOGIC_DEFAULT_VALUE = False

CONCEPT_ID_TABLES = ['drug_era', 'dose_era', 'condition_era']
CONCEPT_ID_DEFAULT_VALUES = {
    'dose_era': 0,
    'drug_era': 38000182,
    'condition_era': 38000247,
}

DEFAULT_PERSON_VALUES = {
    'allowUnknownGender': False,
    'allowGenderChanges': True,
    'allowMultipleYearsOfBirth': True,
    'allowUnknownYearOfBirth': False,
    'implausibleYearOfBirth': {
        'beforeYear': 2023,
        'afterYear': 0,
    },
    'allowInvalidObservationTime': True,
}