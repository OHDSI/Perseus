from werkzeug.utils import secure_filename
import os
import pandas as pd
from cdm_souffleur.model import atc_to_rxnorm
from cdm_souffleur.model.code_mapping import CodeMapping, CodeMappingEncoder
from cdm_souffleur.model.source_code import SourceCode
from cdm_souffleur.utils import InvalidUsage
from cdm_souffleur.utils.constants import UPLOAD_SOURCE_CODES_FOLDER, CONCEPT_IDS, SOURCE_CODE_TYPE_STRING
import pysolr
from cdm_souffleur import app, json

solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/test1/", always_commit=True)

def create_source_codes(current_user, file_name, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    filepath = f"{UPLOAD_SOURCE_CODES_FOLDER}/{current_user}/{file_name}"
    code_file = pd.read_csv(filepath, delimiter=',').fillna('')
    source_codes = []
    for index, row in code_file.iterrows():
        source_codes.append(add_source_code(row, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns))
    return source_codes

def add_source_code(row, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    new_code = SourceCode()
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
                    new_code.source_auto_assigned_concept_ids = new_code.source_auto_assigned_concept_ids.add(int(concept_id))
        else:
            concept_id_2_query = atc_to_rxnorm.select().where(atc_to_rxnorm.concept_code == row[auto_concept_id_column])
            for item in concept_id_2_query:
                new_code.source_auto_assigned_concept_ids = new_code.source_auto_assigned_concept_ids.add(item.concept_id_2)
    if additional_info_columns:
        new_code.source_additional_info.append({additional_info_columns: row[additional_info_columns]})
    return new_code


def load_codes_to_server(file, current_user):
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
            codes_file = csv_to_json(f"{UPLOAD_SOURCE_CODES_FOLDER}/{current_user}/{filename}")
    except Exception as error:
        raise InvalidUsage('Codes were not loaded', 400)
    return codes_file


def csv_to_json(filepath):
    json_file = {}
    data = pd.read_csv(filepath, delimiter=',').fillna('')
    for col in data.columns:
        json_file[col] = data[col].tolist()
    return json_file


def create_derived_index(source_codes):
    for item in source_codes:
        solr.add({
            "term": item.source_name,
            "type": SOURCE_CODE_TYPE_STRING,
        })
    return

def create_concept_mapping(current_user, file_name, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns):
    source_codes = create_source_codes(current_user, file_name, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns)
    create_derived_index(source_codes)
    global_mapping_list = []
    for source_code in source_codes:
        code_mapping = CodeMapping()
        code_mapping.source_code = source_code
        code_mapping.targetConcepts = search(source_code.source_name).docs
        code_mapping.source_code.source_auto_assigned_concept_ids = list(code_mapping.source_code.source_auto_assigned_concept_ids)
        global_mapping_list.append(code_mapping)
    test = json.dumps(global_mapping_list, indent=4, cls=CodeMappingEncoder)
    return json.dumps(global_mapping_list, indent=4, cls=CodeMappingEncoder)

def search(query):
    results = solr.search(f"term:{query}", **{
        'rows': 100,
    })
    return results

def test_solr():
    solr.add({
        "term": "test_test1",
        "type": "A test document",
    })
    solr.ping()
    return True