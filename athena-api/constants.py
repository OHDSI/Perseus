VOCABULARY_FILTERS = {
    'concept_class_id': 'conceptClass',
    'domain_id': 'domain',
    'invalid_reason': 'invalidReason',
    'standard_concept': 'standardConcept',
    'vocabulary_id': 'vocabulary',
}

ATHENA_CORE_NAME = 'athena'
ATHENA_FULL_DATA_IMPORT = f"solr/{ATHENA_CORE_NAME}/dataimport?command=full-import"
ATHENA_IMPORT_STATUS = f"solr/{ATHENA_CORE_NAME}/dataimport?command=status&indent=on&wt=json"
