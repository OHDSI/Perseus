import json
import os
from time import perf_counter
import pandas as pd
import pysolr
import os.path
import datetime

from werkzeug.utils import secure_filename

from app import app
from model.usagi_data.atc_to_rxnorm import atc_to_rxnorm
from model.usagi_data.code_mapping import CodeMappingEncoder, CodeMapping, MappingTarget, MappingStatus
from model.usagi.code_mapping_snapshot import CodeMappingSnapshot
from model.usagi.code_mapping_conversion_result import CodeMappingConversionResult
from model.usagi.code_mapping_conversion_log import CodeMappingConversionLog
from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.conversion_status import ConversionStatus
from model.usagi_data.source_code import SourceCode
from model.vocabulary.source_to_concept_map import Source_To_Concept_Map
from service.search_service import search_usagi
from util.async_directive import fire_and_forget_load_vocabulary, fire_and_forget_concept_mapping
from util.constants import CONCEPT_IDS, UPLOAD_SOURCE_CODES_FOLDER, SOURCE_CODE_TYPE_STRING, SOLR_FILTERS, \
    USAGI_CORE_NAME
from util.exception import InvalidUsage

saved_import_results = {}
fetched_vocabularies = {}


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


def load_codes_to_server(file, delimiter, current_user):
    try:
        if file:
            filename = secure_filename(file.filename)
            try:
                os.makedirs(f"{UPLOAD_SOURCE_CODES_FOLDER}/{current_user}")
                print(f"Directory {UPLOAD_SOURCE_CODES_FOLDER}/{current_user} created")
            except FileExistsError:
                print(f"Directory {UPLOAD_SOURCE_CODES_FOLDER}/{current_user} already exist")
            file.save(f"{UPLOAD_SOURCE_CODES_FOLDER}/{current_user}/{filename}")
            file.close()
            codes_file = csv_to_json(f"{UPLOAD_SOURCE_CODES_FOLDER}/{current_user}/{filename}", delimiter)
    except Exception as error:
        raise InvalidUsage('Codes were not loaded', 400)
    return codes_file


def csv_to_json(filepath, delimiter):
    json_file = []
    data = pd.read_csv(filepath, delimiter=delimiter, error_bad_lines=False).fillna('')
    for row in data.iterrows():
        json_row = {}
        for col in data.columns:
            json_row[col] = str(row[1][col])
        json_file.append(json_row)
    return json_file


def create_derived_index(current_user, source_codes):
    solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{current_user}",
                       always_commit=True)
    for item in source_codes:
        solr.add({
            "term": item.source_name,
            "type": SOURCE_CODE_TYPE_STRING,
        })
    return


@fire_and_forget_concept_mapping
def create_concept_mapping(conversion, current_user, codes, filters, source_code_column, source_name_column, source_frequency_column,
                           auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    try:
        source_codes = create_source_codes(current_user, codes, source_code_column, source_name_column,
                                           source_frequency_column, auto_concept_id_column, concept_ids_or_atc,
                                           additional_info_columns)
        global_mapping_list = []
        for idx, source_code in enumerate(source_codes):
            code_mapping = CodeMapping()
            code_mapping.sourceCode = source_code
            code_mapping.sourceCode.source_auto_assigned_concept_ids = \
                list(code_mapping.sourceCode.source_auto_assigned_concept_ids) if code_mapping.sourceCode.source_auto_assigned_concept_ids else []
            CodeMappingConversionLog.create(
                message=f"Searching {source_code.source_name}",
                percent=100//len(source_codes)*idx,
                status_code=ConversionStatus.IN_PROGRESS.value,
                status_name=ConversionStatus.IN_PROGRESS.name,
                conversion=conversion
            )
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
            global_mapping_list.append(code_mapping)
        saved_import_results[current_user] = global_mapping_list
        CodeMappingConversion.update(
            status_code=ConversionStatus.COMPLETED.value,
            status_name=ConversionStatus.COMPLETED.name,
        ).where(CodeMappingConversion.id==conversion.id).execute()
        CodeMappingConversionLog.create(
                message="Import finished",
                percent=100,
                status_code=ConversionStatus.COMPLETED.value,
                status_name=ConversionStatus.COMPLETED.name,
                conversion=conversion
            )
        CodeMappingConversionResult.create(result=ConversionStatus.COMPLETED.value, conversion=conversion)
    except Exception as error:
        CodeMappingConversionLog.create(
                message=error.__str__(),
                percent=0,
                status_code=ConversionStatus.FAILED.value,
                status_name=ConversionStatus.FAILED.name,
                conversion=conversion
            )
        CodeMappingConversionResult.create(result=ConversionStatus.FAILED.value, conversion=conversion)


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
                        mapped_code = Source_To_Concept_Map(source_concept_id=source_concept_id,
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


def delete_vocabulary(vocabulary_name, current_user):
    try:
        delete_vocabulary_query = CodeMappingSnapshot.delete().where((CodeMappingSnapshot.username == current_user) & (CodeMappingSnapshot.name == vocabulary_name))
        delete_vocabulary_query.execute()
        delete_rows_query = Source_To_Concept_Map.delete().where((Source_To_Concept_Map.source_vocabulary_id == vocabulary_name) & (Source_To_Concept_Map.username == current_user))
        delete_rows_query.execute()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 400)


def get_vocabulary_list_for_user(current_user):
    result = []
    saved_mapped_concepts = CodeMappingSnapshot.select().where(CodeMappingSnapshot.username == current_user).order_by(CodeMappingSnapshot.time.desc())
    if saved_mapped_concepts.exists():
        for item in saved_mapped_concepts:
            result.append(item.name)
    return result


@fire_and_forget_load_vocabulary
def load_mapped_concepts_by_vocabulary_name(vocabulary_name, current_user):
    try:
        saved_mapped_concepts = CodeMappingSnapshot.select().where(
            (CodeMappingSnapshot.username == current_user) & (CodeMappingSnapshot.name == vocabulary_name))
        if saved_mapped_concepts.exists():
            codes_and_saved_mappings_string = saved_mapped_concepts.get().codes_and_mapped_concepts
            codes_and_saved_mappings = json.loads(codes_and_saved_mappings_string)
            fetched_vocabularies[current_user] = codes_and_saved_mappings
        else:
            raise InvalidUsage('Vocabulary not found', 404)
    except Exception as error:
        raise InvalidUsage('Load mapped concepts by vocabulary name failed', 500)
    return


def get_vocabulary_data(current_user):
    result = fetched_vocabularies[current_user]
    fetched_vocabularies.pop(current_user, None)
    return result


def get_filters(current_user):
    solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{USAGI_CORE_NAME}",
                       always_commit=True)
    facets = {}
    for key in SOLR_FILTERS:
        params = {
            'facet': 'on',
            'facet.field': key,
            'rows': '0',
        }
        results = solr.search("*:*", **params)
        facets_string_values = [x for x in results.facets['facet_fields'][key]if not isinstance(x, int)]
        facets[SOLR_FILTERS[key]] = sorted(facets_string_values)
    return facets


