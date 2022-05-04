from model.usagi2.code_mapping_conversion import CodeMappingConversion
from model.usagi2.code_mapping_conversion_log import CodeMappingConversionLog
from model.usagi2.code_mapping_conversion_result import CodeMappingConversionResult
from model.usagi2.code_mapping_snapshot import CodeMappingSnapshot
from util.usagi_db import usagi_pg_db


def create_usagi2_tables():
    usagi_pg_db.create_tables([
        CodeMappingConversion,
        CodeMappingConversionLog,
        CodeMappingConversionResult,
        CodeMappingSnapshot
    ])