from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.code_mapping_conversion_result import CodeMappingConversionResult
from service.code_mapping_conversion_service import get_conversion_by_username


def create_code_mapping_result(result: str, conversion: CodeMappingConversion):
    return CodeMappingConversionResult.create(
        result=result,
        conversion=conversion
    )


def get_code_mapping_result(conversion_id: int, username: str) -> CodeMappingConversionResult:
    conversion = get_conversion_by_username(conversion_id, username)
    return CodeMappingConversionResult.get(CodeMappingConversionResult.conversion == conversion)
