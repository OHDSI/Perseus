from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.code_mapping_conversion_log import CodeMappingConversionLog
from model.usagi.conversion_status import ConversionStatus


def create_log(message: str,
               percent: int,
               status: ConversionStatus,
               conversion: CodeMappingConversion):
    return CodeMappingConversionLog.create(
        message=message,
        percent=percent,
        status_code=status.value,
        status_name=status.name,
        conversion=conversion
    )


def get_logs(conversion: CodeMappingConversion):
    return CodeMappingConversionLog.select(
        CodeMappingConversionLog.message,
        CodeMappingConversionLog.status_code,
        CodeMappingConversionLog.status_name,
        CodeMappingConversionLog.percent
    ).where(
        CodeMappingConversionLog.conversion == conversion
    ).dicts()