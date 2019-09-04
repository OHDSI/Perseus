from pathlib import Path

GENERATE_CDM_SOURCE_DATA_PATH = Path('generate/CDM_source_data')
GENERATE_CDM_SOURCE_METADATA_PATH = Path('generate/CDM_source_data/metadata')
GENERATE_CDM_XML_PATH = Path('generate/CDM_xml')
GENERATE_CDM_XML_ARCHIVE_PATH = Path('generate')
GENERATE_CDM_XML_ARCHIVE_FILENAME = 'CDM_xml'
GENERATE_CDM_XML_ARCHIVE_FORMAT = 'zip'
FORMAT_SQL_FOR_SPARK_PARAMS = {
    "  JOIN _CHUNKS CH ON CH.CHUNKID = {0} AND ENROLID = CH.PERSON_ID "
    "ORDER BY PERSON_ID": '',
    "VARCHAR": "STRING", '&LT;': '<', '&GT;': '>', 'NULL AS': '"" AS'}
CDM_SCHEMA_PATH = Path('sources/CDM/')
CDM_VERSION_LIST = ['4', '5.0.1', '5.1.0', '5.2.0', '5.3.0', '5.3.1', '5', ]
UPLOAD_SOURCE_SCHEMA_FOLDER = Path('generate/income_schema')
