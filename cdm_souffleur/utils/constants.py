from pathlib import Path

GENERATE_CDM_SOURCE_DATA_PATH = Path('generate/CDM_source_data')
GENERATE_CDM_SOURCE_METADATA_PATH = Path('generate/CDM_source_data/metadata')
FORMAT_SQL_FOR_SPARK_PARAMS = {
    "  JOIN _CHUNKS CH ON CH.CHUNKID = {0} AND ENROLID = CH.PERSON_ID "
    "ORDER BY PERSON_ID": '',
    "VARCHAR": "STRING", '&LT;': '<', '&GT;': '>', 'NULL AS': '"" AS'}
