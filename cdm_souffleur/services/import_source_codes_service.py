from werkzeug.utils import secure_filename
import os
import pandas as pd
from cdm_souffleur.model import atc_to_rxnorm
from cdm_souffleur.model.code_mapping import CodeMapping, CodeMappingEncoder, ScoredConcept, MappingTarget, \
    MappingStatus, TargetConcept
from cdm_souffleur.model.concept import Concept
from cdm_souffleur.model.conceptVocabularyModel import Source_To_Concept_Map
from cdm_souffleur.model.source_code import SourceCode
from cdm_souffleur.services.solr_core_service import create_core
from cdm_souffleur.utils import InvalidUsage
from cdm_souffleur.utils.constants import UPLOAD_SOURCE_CODES_FOLDER, CONCEPT_IDS, SOURCE_CODE_TYPE_STRING, SOLR_PATH
import pysolr
from cdm_souffleur import app, json


def create_source_codes(current_user, codes, source_code_column, source_name_column, source_frequency_column,
                        auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    source_codes = []
    for row in codes:
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
            for concept_id in row[auto_concept_id_column].split(';'):
                if concept_id != "":
                    new_code.source_auto_assigned_concept_ids = new_code.source_auto_assigned_concept_ids.add(
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
    data = pd.read_csv(filepath, delimiter=delimiter).fillna('')
    for row in data.iterrows():
        json_row = {}
        for col in data.columns:
            json_row[col] = row[1][col]
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


def create_concept_mapping(current_user, file_name, source_code_column, source_name_column, source_frequency_column,
                           auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    source_codes = create_source_codes(current_user, file_name, source_code_column, source_name_column,
                                       source_frequency_column, auto_concept_id_column, concept_ids_or_atc,
                                       additional_info_columns)
    create_core(current_user)
    create_derived_index(current_user, source_codes)
    global_mapping_list = []
    for source_code in source_codes:
        code_mapping = CodeMapping()
        code_mapping.sourceCode = source_code
        code_mapping.sourceCode.source_auto_assigned_concept_ids = list(code_mapping.sourceCode.source_auto_assigned_concept_ids)
        scored_concepts = search(current_user, source_code.source_name)
        if len(scored_concepts):
            code_mapping.targetConcept = MappingTarget(concept=scored_concepts[0].concept, createdBy='<auto>')
            code_mapping.matchScore = scored_concepts[0].match_score
        else:
            code_mapping.matchScore = 0
        if len(source_code.source_auto_assigned_concept_ids) == 1 and len(scored_concepts):
            code_mapping.mappingStatus = MappingStatus.AUTO_MAPPED_TO_1
        elif len(source_code.source_auto_assigned_concept_ids) > 1 and len(scored_concepts):
            code_mapping.mappingStatus = MappingStatus.AUTO_MAPPED
        global_mapping_list.append(code_mapping)
    return json.dumps(global_mapping_list, cls=CodeMappingEncoder)


def create_target_concept(concept):
    return TargetConcept(concept.concept_id,
                         concept.concept_name,
                         concept.concept_class_id,
                         concept.vocabulary_id,
                         concept.concept_code,
                         concept.domain_id,
                         concept.valid_start_date.strftime("%Y-%m-%d"),
                         concept.valid_end_date.strftime("%Y-%m-%d"),
                         concept.invalid_reason,
                         concept.standard_concept,
                         "",
                         concept.parent_count,
                         concept.parent_count)


def search(current_user, query):
    solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{current_user}",
                       always_commit=True)
    scored_concepts = []
    results = solr.search(f"term:{query}", **{
        'rows': 100,
        'fl': 'concept_id, term, score'
    }).docs
    for item in results:
        if 'concept_id' in item:
            target_concept = Concept.select().where(Concept.concept_id == item['concept_id']).get()
            concept = create_target_concept(target_concept)
            scored_concepts.append(ScoredConcept(item['score'], concept, item['term']))
    return scored_concepts


def save_codes(current_user, mapped_codes):
    for item in mapped_codes:
        mapped_code = Source_To_Concept_Map(source_concept_id=item['sourceConceptId'],
                                            source_code=item['sourceCode'],
                                            source_vocabulary_id=item['sourceVocabularyId'],
                                            source_code_description=item['sourceCodeDescription'],
                                            target_concept_id=item['targetConceptId'],
                                            target_vocabulary_id=item['targetVocabularyId'],
                                            valid_start_date=item['validStartDate'],
                                            valid_end_date=item['validEndDate'],
                                            invalid_reason=item['invalidReason'],
                                            username=current_user)
        mapped_code.save()
    return True
