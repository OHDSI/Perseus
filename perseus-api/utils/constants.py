from pathlib import Path

CDM_VERSION_LIST = ['4', '5.0.1', '5.1.0', '5.2.0', '5.3.0', '5.3.1', '5.4', '5', ]

CDM_SCHEMA_PATH = Path('model/sources/CDM/')
PREDEFINED_LOOKUPS_PATH = Path('model/lookups')

generate_folder = Path('cache/generate')
GENERATE_ETL_XML_PATH = Path(generate_folder, 'xml-definitions')
GENERATE_LOOKUP_SQL_PATH = Path(generate_folder, 'lookups')
GENERATE_BATCH_SQL_PATH = Path(generate_folder, 'batch')
GENERATE_CDM_XML_ARCHIVE_PATH = Path(generate_folder, 'zip_xml')
GENERATE_ETL_ARCHIVE_PATH = Path(generate_folder, 'zip_etl')

GENERATE_CDM_XML_ARCHIVE_FILENAME = 'etl_xml'
CDM_XML_ARCHIVE_FORMAT = 'zip'
ETL_MAPPING_ARCHIVE_FORMAT = 'zip'

upload_folder = Path('cache/upload')
UPLOAD_SCAN_REPORT_FOLDER = Path(upload_folder, 'scan-reports')
UPLOAD_ETL_FOLDER = Path(upload_folder, 'etl')
INCOME_LOOKUPS_PATH = Path(upload_folder, 'user_defined_lookups')

LOOKUP_MAX_LENGTH = 10000

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

SCAN_REPORT_DATA_KEY = 'scan-report'

SOURCE_TO_SOURCE_LOOKUP_TYPE = ''
