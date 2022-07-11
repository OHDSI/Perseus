from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.code_mapping_conversion_log import CodeMappingConversionLog
from model.usagi.conversion_status import ConversionStatus


def create_conversion(username: str):
    return CodeMappingConversion.create(
        username=username,
        status_code=ConversionStatus.IN_PROGRESS.value,
        status_name=ConversionStatus.IN_PROGRESS.name
    )


def update_conversion(id: int, status: ConversionStatus):
    CodeMappingConversion.update(
        status_code=status.value,
        status_name=status.name,
    ).where(
        CodeMappingConversion.id == id
    ).execute()


def get_conversion(conversion_id: int):
    return CodeMappingConversion.get(CodeMappingConversion.id == conversion_id)


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