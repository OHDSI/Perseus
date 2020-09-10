from pathlib import Path

GENERATE_CDM_SOURCE_DATA_PATH = Path('model/generate/CDM_source_data')
GENERATE_CDM_SOURCE_METADATA_PATH = Path('model/generate/CDM_source_data/metadata')
GENERATE_CDM_XML_PATH = Path('model/generate/Definitions')
GENERATE_CDM_LOOKUP_SQL_PATH = Path('model/generate/Lookups')
GENERATE_CDM_SQL_TRANSFORMATION_PATH = Path('model/generate/SqlTransformations')
GENERATE_BATCH_SQL_PATH = Path('model/generate/Batch.sql')
GENERATE_CDM_XML_ARCHIVE_PATH = Path('model/generate')
GENERATE_CDM_XML_ARCHIVE_FILENAME = 'CDM_xml'
GENERATE_CDM_XML_ARCHIVE_FORMAT = 'zip'
FORMAT_SQL_FOR_SPARK_PARAMS = {
    "  JOIN _CHUNKS CH ON CH.CHUNKID = {0} AND ENROLID = CH.PERSON_ID "
    "ORDER BY PERSON_ID": '',
    "VARCHAR": "STRING", '&LT;': '<', '&GT;': '>', 'NULL AS': '"" AS'}
CDM_SCHEMA_PATH = Path('model/sources/CDM/')
VOCABULARY_DESCRIPTION_PATH = Path('model/sources/VOCABULARY.csv')
CDM_VERSION_LIST = ['4', '5.0.1', '5.1.0', '5.2.0', '5.3.0', '5.3.1', '5', '6', ]
UPLOAD_SOURCE_SCHEMA_FOLDER = Path('model/generate/income_schema')
PREDEFINED_LOOKUPS_PATH = Path('model/Lookups')
INCOME_LOOKUPS_PATH = Path('model/UserDefinedLookups')
BATCH_SQL_PATH = Path('model/Batch.sql')


