from pathlib import Path

from app import app

USAGI_CORE_NAME = 'usagi'

SOLR_CONN_STRING = f"{app.config['SOLR_URL']}/solr/{USAGI_CORE_NAME}"

CONCEPT_IDS = 'autoConceptId'
SOURCE_CODE_TYPE_STRING = "S"

SOLR_FILTERS = {
    'vocabulary_id': 'vocabularies',
    'concept_class_id': 'conceptClasses',
    'domain_id': 'domains'
}

UPLOAD_SOURCE_CODES_FOLDER = Path('model/generate/source_codes')

QUERY_SEARCH_MODE = 'query'

INSERT_BATCH_SIZE = 10000
