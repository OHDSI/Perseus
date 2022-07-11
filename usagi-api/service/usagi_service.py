import datetime
import json
import traceback

from app import app
from model.usagi.code_mapping_snapshot import CodeMappingSnapshot
from model.usagi.conversion_status import ConversionStatus
from model.usagi_data.atc_to_rxnorm import atc_to_rxnorm
from model.usagi_data.code_mapping import CodeMappingEncoder, CodeMapping, MappingTarget, MappingStatus
from model.usagi_data.source_code import SourceCode
from model.vocabulary.source_to_concept_map import SourceToConceptMap
from service.code_mapping_conversion_service import create_log, update_conversion, create_conversion
from service.search_service import search_usagi
from service.store_csv_service import store_and_parse_csv
from util.async_directive import fire_and_forget_concept_mapping
from util.constants import CONCEPT_IDS
from util.exception import InvalidUsage

saved_import_results = {}


def load_codes_to_server(file, delimiter, username):
    if file:
        file_save_response, source_codes_in_json = store_and_parse_csv(file, delimiter, username)
        conversion = create_conversion(username, file_save_response.id)
        return conversion, source_codes_in_json, file_save_response.filePath
    else:
        raise InvalidUsage('Request does not contains CSV file')


def create_source_codes(current_user, codes, source_code_column, source_name_column, source_frequency_column,
                        auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    source_codes = []
    for row in codes:
        if 'selected' in row:
            if row['selected']:
                source_codes.append(add_source_code(row, source_code_column, source_name_column, source_frequency_column,
                                            auto_concept_id_column, concept_ids_or_atc, additional_info_columns, row))
    return source_codes


def add_source_code(row, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column,
                    concept_ids_or_atc, additional_info_columns, code):
    new_code = SourceCode()
    new_code.code = code
    if not source_code_column:
        new_code.source_code = ''
    else:
        new_code.source_code = row[source_code_column]
    new_code.source_name = row[source_name_column]
    if source_frequency_column:
        new_code.source_frequency = int(row[source_frequency_column])
    else:
        new_code.source_frequency = -1
    if auto_concept_id_column:
        if concept_ids_or_atc == CONCEPT_IDS:
            new_code.source_auto_assigned_concept_ids = set()
            for concept_id in str(row[auto_concept_id_column]).split(';'):
                if concept_id != "":
                    new_code.source_auto_assigned_concept_ids.add(
                        int(concept_id))
        else:
            concept_id_2_query = atc_to_rxnorm.select().where(atc_to_rxnorm.concept_code == row[auto_concept_id_column])
            for item in concept_id_2_query:
                new_code.source_auto_assigned_concept_ids = new_code.source_auto_assigned_concept_ids.add(
                    item.concept_id_2)
    if additional_info_columns:
        new_code.source_additional_info.append({additional_info_columns: row[additional_info_columns]})
    return new_code


@fire_and_forget_concept_mapping
def create_concept_mapping(conversion,
                           current_user,
                           codes,
                           filters,
                           source_code_column,
                           source_name_column,
                           source_frequency_column,
                           auto_concept_id_column,
                           concept_ids_or_atc,
                           additional_info_columns):
    try:
        source_codes = create_source_codes(current_user,
                                           codes,
                                           source_code_column,
                                           source_name_column,
                                           source_frequency_column,
                                           auto_concept_id_column,
                                           concept_ids_or_atc,
                                           additional_info_columns)
        mapping_list = []
        for idx, source_code in enumerate(source_codes):
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
            scored_concepts = search_usagi(filters, source_code.source_name, source_code.source_auto_assigned_concept_ids)
            if len(scored_concepts):
                target_concept = MappingTarget(concept=scored_concepts[0].concept, createdBy='<auto>', term=scored_concepts[0].term)
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

        saved_import_results[current_user] = mapping_list
        update_conversion(conversion.id, ConversionStatus.COMPLETED)
        create_log(message="Import finished",
                   percent=100,
                   status=ConversionStatus.COMPLETED,
                   conversion=conversion)
    except Exception as error:
        update_conversion(conversion.id, ConversionStatus.COMPLETED)
        create_log(message=error.__str__(),
                   percent=0,
                   status=ConversionStatus.FAILED,
                   conversion=conversion)
        app.logger.error(error.__str__())
        traceback.print_tb(error.__traceback__)


def get_saved_code_mapping(current_user):
    result = json.dumps(saved_import_results[current_user], cls=CodeMappingEncoder)
    saved_import_results.pop(current_user, None)
    return result


def save_codes(current_user, codes, mapping_params, mapped_codes, filters, vocabulary_name, conversion):
    try:
        for item in mapped_codes:
            if 'approved' in item:
                if item['approved']:
                    source_concept_id = 0
                    source_code = item['sourceCode']['source_code']
                    source_code_description = item['sourceCode']['source_name']
                    for concept in item['targetConcepts']:
                        mapped_code = SourceToConceptMap(source_concept_id=source_concept_id,
                                                         source_code=source_code,
                                                         source_vocabulary_id=vocabulary_name,
                                                         source_code_description=source_code_description,
                                                         target_concept_id=concept['concept']['conceptId'],
                                                         target_vocabulary_id= "None" if concept['concept']['vocabularyId'] == "0" else concept['concept']['vocabularyId'],
                                                         valid_start_date="1970-01-01",
                                                         valid_end_date="2099-12-31",
                                                         invalid_reason="",
                                                         username=current_user)
                        mapped_code.save()

        save_source_codes_and_mapped_concepts_in_db(current_user, codes, mapping_params, mapped_codes, filters, vocabulary_name, conversion)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 400)
    return True


def save_source_codes_and_mapped_concepts_in_db(current_user, codes, mapping_params, mapped_codes, filters, vocabulary_name, conversion):
    source_and_mapped_codes_dict = {'codes': codes, 'mappingParams': mapping_params, 'codeMappings': mapped_codes, 'filters': filters}
    source_and_mapped_codes_string = json.dumps(source_and_mapped_codes_dict)

    saved_mapped_concepts = CodeMappingSnapshot.select().where(
        (CodeMappingSnapshot.username == current_user) & (CodeMappingSnapshot.name == vocabulary_name))
    if saved_mapped_concepts.exists():
        saved_mapped_concepts = saved_mapped_concepts.get()
        saved_mapped_concepts.codes_and_mapped_concepts = source_and_mapped_codes_string
        saved_mapped_concepts.created_on = datetime.datetime.utcnow()
        saved_mapped_concepts.save()
    else:
        new_saved_mapped_concepts = CodeMappingSnapshot(name=vocabulary_name,
                                                        snapshot=source_and_mapped_codes_string,
                                                        username=current_user,
                                                        time=datetime.datetime.utcnow(),
                                                        conversion=conversion)
        new_saved_mapped_concepts.save()
    return


