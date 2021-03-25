from pathlib import Path
from os.path import dirname
import sys

ROOT_DIR = Path(dirname(sys.modules['__main__'].__file__))
GENERATE_CDM_SOURCE_DATA_PATH = Path('model/generate/CDM_source_data')
GENERATE_CDM_SOURCE_METADATA_PATH = Path('model/generate/CDM_source_data/metadata')
GENERATE_CDM_XML_PATH = Path('model/generate/Definitions')
GENERATE_CDM_LOOKUP_SQL_PATH = Path('model/generate/Lookups')
GENERATE_BATCH_SQL_PATH = Path('model/generate/')
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

COLUMN_TYPES_MAPPING = {
     16: 'bool',
     17: 'blob',
     20: 'bigint',
     21: 'smallint',
     23: 'int',
     25: 'text',
     700: 'real',
     701: 'double precision',
     1042: 'char',
     1043: 'varchar',
     1082: 'date',
     1114: 'datetime',
     1184: 'datetime',
     1083: 'time',
     1266: 'time',
     1700: 'decimal',
     2950: 'uuid',
}

TYPES_WITH_MAX_LENGTH = [
  "varchar",
  "nvarchar",
  "character",
  "character varying",
  "char",
  "text"
]

LIST_OF_COLUMN_INFO_FIELDS = [
    "Field",
    "Table",
    "Type",
    "N unique values",
    "Fraction empty"
]

N_ROWS_FIELD_NAME = 'N rows'

VOCABULARY_FILTERS = {
    'concept_class_id': 'conceptClass',
    'domain_id': 'domain',
    'invalid_reason': 'invalidReason',
    'standard_concept': 'standardConcept',
    'vocabulary_id': 'vocabulary',
}
