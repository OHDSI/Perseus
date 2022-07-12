from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.conversion_status import ConversionStatus
from util.exception import InvalidUsage


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


def get_conversion(conversion_id: int) -> CodeMappingConversion:
    return CodeMappingConversion.get(CodeMappingConversion.id == conversion_id)


def get_conversion_by_username(conversion_id: int, username: str) -> CodeMappingConversion:
    conversion = CodeMappingConversion.get(CodeMappingConversion.id == conversion_id)
    if conversion.username != username:
        raise InvalidUsage('Forbidden', 403)
    return conversion