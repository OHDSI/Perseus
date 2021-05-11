import json
import subprocess
from flask import jsonify, Blueprint
from cdm_souffleur.model.code_mapping import ScoredConceptEncoder
from cdm_souffleur.services.authorization_service import *
from cdm_souffleur.services.import_source_codes_service import create_source_codes, load_codes_to_server, \
    create_concept_mapping, search, create_core
from cdm_souffleur.services.solr_core_service import run_solr_command, import_status_scheduler, main_index_created, \
    full_data_import
from cdm_souffleur.utils.constants import SOLR_CREATE_MAIN_INDEX_CORE, SOLR_FULL_DATA_IMPORT, SOLR_IMPORT_STATUS

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
        result = create_concept_mapping(current_user, codes, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return result


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
