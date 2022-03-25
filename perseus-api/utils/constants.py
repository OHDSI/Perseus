import sys
from os.path import dirname
from pathlib import Path

ROOT_DIR = Path(dirname(sys.modules['__main__'].__file__))
GENERATE_CDM_XML_PATH = Path('model/generate/Definitions') # todo make stateless - xml used by cdm builder
GENERATE_CDM_LOOKUP_SQL_PATH = Path('model/generate/Lookups') # todo make stateless - for cmd builder
GENERATE_BATCH_SQL_PATH = Path('model/generate/batch') # todo make stateless - for cmd builder
GENERATE_CDM_XML_ARCHIVE_PATH = Path('model/generate') # todo make stateless
GENERATE_CDM_XML_ARCHIVE_FILENAME = 'CDM_xml'
GENERATE_CDM_XML_ARCHIVE_FORMAT = 'zip'
CDM_SCHEMA_PATH = Path('model/sources/CDM/') # CDM versions
CDM_VERSION_LIST = ['4', '5.0.1', '5.1.0', '5.2.0', '5.3.0', '5.3.1', '5.4', '5', '6', ]
UPLOAD_SOURCE_SCHEMA_FOLDER = Path('model/generate/income_schema') # todo make stateless - WR scan report
UPLOAD_SOURCE_CODES_FOLDER = Path('model/generate/source_codes') # todo make stateless
PREDEFINED_LOOKUPS_PATH = Path('model/Lookups') # not changed
INCOME_LOOKUPS_PATH = Path('model/UserDefinedLookups') # todo make stateless

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
   "text",
  "timestamp",
  "timestamp(p) with time zone"
]

LIST_OF_COLUMN_INFO_FIELDS = [
    "Field",
    "Table",
    "Type",
    "N unique values",
    "Fraction empty"
]

N_ROWS_CHECKED_FIELD_NAME = 'N rows checked'
N_ROWS_FIELD_NAME = 'N rows'