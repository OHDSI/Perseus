import json
import traceback
from typing import List

from app import app
from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.conversion_status import ConversionStatus
from model.usagi_data.code_mapping import CodeMappingEncoder, CodeMapping, MappingTarget, MappingStatus
from service.code_mapping_conversion_service import update_conversion, create_conversion, get_conversion
from service.code_mapping_log_service import create_log
from service.code_mapping_result_service import create_code_mapping_result, get_code_mapping_result
from service.code_mapping_snapshot_service import create_or_update_snapshot
from service.search_service import search_usagi
from service.source_codes_service import create_source_codes
from service.source_to_concept_map_service import save_source_to_concept_map
from service.store_csv_service import store_and_parse_csv
from util.async_directive import fire_and_forget_concept_mapping
from util.exception import InvalidUsage


def extract_codes_from_csv(file, delimiter, username):
    if file:
        return store_and_parse_csv(file, delimiter, username)
    else:
        raise InvalidUsage('Request does not contain CSV file')


"""
@param username used in fire_and_forget_concept_mapping decorator
"""
@fire_and_forget_concept_mapping
def create_concept_mapping(username: str,
                           conversion: CodeMappingConversion,
                           codes,
                           filters,
                           source_code_column,
                           source_name_column,
                           source_frequency_column,
                           auto_concept_id_column,
                           concept_ids_or_atc,
                           additional_info_columns):
    try:
        source_codes = create_source_codes(codes,
                                           source_code_column,
                                           source_name_column,
                                           source_frequency_column,
                                           auto_concept_id_column,
                                           concept_ids_or_atc,
                                           additional_info_columns)
        mapping_list: List[CodeMapping] = []
        for idx, source_code in enumerate(source_codes):
            conversion_from_db = get_conversion(conversion.id)
            if conversion_from_db.status_code == ConversionStatus.ABORTED.value:
                return
            code_mapping = CodeMapping()
            code_mapping.sourceCode = source_code
            code_mapping.sourceCode.source_auto_assigned_concept_ids = []
            if code_mapping.sourceCode.source_auto_assigned_concept_ids:
                code_mapping.sourceCode.source_auto_assigned_concept_ids = \
                    list(code_mapping.sourceCode.source_auto_assigned_concept_ids)
            create_log(message=f"Searching {source_code.source_name}",
                       percent=100 // len(source_codes) * idx,
                       status=ConversionStatus.IN_PROGRESS,
                       conversion=conversion)
            scored_concepts = search_usagi(filters, source_code.source_name,
                                           source_code.source_auto_assigned_concept_ids)
            if len(scored_concepts):
                target_concept = MappingTarget(concept=scored_concepts[0].concept, createdBy='<auto>',
                                               term=scored_concepts[0].term)
                code_mapping.targetConcepts = [target_concept]
                code_mapping.matchScore = scored_concepts[0].match_score
            else:
                code_mapping.targetConcept = None
                code_mapping.matchScore = 0
            if len(source_code.source_auto_assigned_concept_ids) == 1 and len(scored_concepts):
                code_mapping.mappingStatus = MappingStatus.AUTO_MAPPED_TO_1
            elif len(source_code.source_auto_assigned_concept_ids) > 1 and len(scored_concepts):
                code_mapping.mappingStatus = MappingStatus.AUTO_MAPPED
            mapping_list.append(code_mapping)

        create_code_mapping_result(json.dumps(mapping_list, cls=CodeMappingEncoder), conversion)
        update_conversion(conversion.id, ConversionStatus.COMPLETED)
        create_log(message="Import finished",
                   percent=100,
                   status=ConversionStatus.COMPLETED,
                   conversion=conversion)
    except Exception as error:
        update_conversion(conversion.id, ConversionStatus.FAILED)
        error_message = error.__str__()
        create_log(message=error_message,
                   percent=100,
                   status=ConversionStatus.FAILED,
                   conversion=conversion)
        app.logger.error(error_message)
        traceback.print_tb(error.__traceback__)


def get_concept_mapping_result(conversion_id: int, username: str):
    code_mapping_result = get_code_mapping_result(conversion_id, username)
    return json.loads(code_mapping_result.result)


def save_concept_mapping_result(username,
                                codes,
                                mapping_params,
                                mapped_codes,
                                filters,
                                snapshot_name,
                                conversion):
    save_source_to_concept_map(mapped_codes, snapshot_name, username)
    create_or_update_snapshot(username, codes, mapping_params, mapped_codes, filters, snapshot_name, conversion)
