from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.code_mapping_conversion_log import CodeMappingConversionLog
from model.usagi.conversion_status import ConversionStatus
from util.exception import InvalidUsage


def create_conversion(username: str, csv_file_id: int):
    return CodeMappingConversion.create(
        username=username,
        csv_file_id=csv_file_id,
        status_code=ConversionStatus.INITIALIZED.value,
        status_name=ConversionStatus.INITIALIZED.name
    )


def update_conversion(id: int, status: ConversionStatus):
    CodeMappingConversion.update(
        status_code=status.value,
        status_name=status.name,
    ).where(
        CodeMappingConversion.id == id
    ).execute()


def get_conversion(conversion_id: int, username: str) -> CodeMappingConversion:
    conversion = CodeMappingConversion.get(CodeMappingConversion.id == conversion_id)
    if conversion.username != username:
        raise InvalidUsage('Forbidden', 403)
    return conversion


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