from app import app

VOCABULARY_FILTERS = {
    'concept_class_id': 'conceptClass',
    'domain_id': 'domain',
    'invalid_reason': 'invalidReason',
    'standard_concept': 'standardConcept',
    'vocabulary_id': 'vocabulary',
}

ATHENA_CORE_NAME = 'athena'

SOLR_CONN_STRING = f"{app.config['SOLR_URL']}/solr/{ATHENA_CORE_NAME}"
