from pathlib import Path

USAGI_CORE_NAME = 'concepts' #todo rename to usagi
USAGI_FULL_DATA_IMPORT = "solr/usagi/dataimport?command=full-import"
USAGI_IMPORT_STATUS = "solr/usagi/dataimport?command=status&indent=on&wt=json"

CONCEPT_IDS = 'autoConceptId'
SOURCE_CODE_TYPE_STRING = "S"

SOLR_FILTERS = {
    'vocabulary_id': 'vocabularies',
    'concept_class_id': 'conceptClasses',
    'domain_id': 'domains'
}

UPLOAD_SOURCE_CODES_FOLDER = Path('model/generate/source_codes')

QUERY_SEARCH_MODE = 'query'