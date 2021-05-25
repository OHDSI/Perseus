import json
import subprocess
from flask import jsonify, Blueprint
from cdm_souffleur.model.code_mapping import ScoredConceptEncoder
from cdm_souffleur.services.authorization_service import *
from cdm_souffleur.services.import_source_codes_service import create_source_codes, load_codes_to_server, \
    create_concept_mapping, search, create_core, save_codes, get_vocabulary_list_for_user, \
    load_mapped_concepts_by_vocabulary_name, get_saved_code_mapping, get_vocabulary_data
from cdm_souffleur.services.solr_core_service import run_solr_command, import_status_scheduler, main_index_created, \
    full_data_import
from cdm_souffleur.utils.constants import SOLR_IMPORT_STATUS
import asyncio
usagi_api = Blueprint('usagi_api', __name__)

@usagi_api.route('/api/import_source_codes', methods=['POST'])
@token_required
def create_codes(current_user):
    try:
        params = request.json['params']
        source_code_column = params['sourceCode']
        source_name_column = params['sourceName']
        source_frequency_column = params['sourceFrequency']
        auto_concept_id_column = params['autoConceptId']
        additional_info_columns = params['additionalInfo']
        concept_ids_or_atc = params['conceptIdsOrAtc'] if 'conceptIdsOrAtc' in params else ''
        codes = request.json['codes']
        filters = request.json['filters']
        create_concept_mapping(current_user, codes, filters, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify('OK')


@usagi_api.route('/api/get_import_source_codes_results', methods=['GET'])
@token_required
def get_import_source_codes_results_call(current_user):
    try:
        import_source_codes_results = get_saved_code_mapping(current_user)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return import_source_codes_results


@usagi_api.route('/api/load_codes_to_server', methods=['POST'])
@token_required
def load_codes_call(current_user):
    """save schema to server and load it from server in the same request"""
    try:
        file = request.files['file']
        delimiter = request.form['delimiter']
        codes_file = load_codes_to_server(file, delimiter, current_user)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(codes_file)


@usagi_api.route('/api/get_term_search_results', methods=['GET'])
@token_required
def get_term_search_results_call(current_user):
    try:
        term = request.args['term']
        search_result = search(current_user, term)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return json.dumps(search_result, indent=4, cls=ScoredConceptEncoder)


@usagi_api.route('/api/save_mapped_codes', methods=['POST'])
@token_required
def save_mapped_codes_call(current_user):
    try:
        codes = request.json['codes']
        mapped_codes = request.json['codeMappings']
        vocabulary_name = request.json['name']
        mapping_params = request.json['mappingParams']
        result = save_codes(current_user, codes, mapping_params, mapped_codes, vocabulary_name)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return json.dumps(result)


@usagi_api.route('/api/get_vocabulary_list', methods=['GET'])
@token_required
def get_vocabulary_list_call(current_user):
    try:
        result = get_vocabulary_list_for_user(current_user)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(result)


@usagi_api.route('/api/get_vocabulary', methods=['GET'])
@token_required
def load_mapped_concepts_call(current_user):
    try:
        vocabulary_name = request.args['name']
        load_mapped_concepts_by_vocabulary_name(vocabulary_name, current_user)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify('OK')


@usagi_api.route('/api/get_vocabulary_data', methods=['GET'])
@token_required
def get_vocabulary_data_call(current_user):
    try:
        result = get_vocabulary_data(current_user)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(result)


@usagi_api.route('/api/solr_import_status', methods=['GET'])
def solr_import_status_call():
    try:
        response = run_solr_command(SOLR_IMPORT_STATUS)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return response


@usagi_api.route('/api/solr_import_data', methods=['GET'])
def solr_import_data_call():
    try:
        response = full_data_import()
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return response


@usagi_api.route('/api/start_solr', methods=['GET'])
def start_solr_call():
    try:
        p = subprocess.Popen([f"solr", "start"], stdout =subprocess.PIPE, stderr =subprocess.PIPE, shell=True)
        output, error = p.communicate()
        if p.returncode != 0:
            print("failed %d %s %s" % (p.returncode, output, error))
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(output)
