from model.usagi.code_mapping_conversion import CodeMappingConversion


def code_mapping_conversion_to_json(conversion: CodeMappingConversion):
    return {'id': conversion.id,
            'statusCode': conversion.status_code,
            'statusName': conversion.status_name}
