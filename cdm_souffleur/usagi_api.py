import json

from flask import request, jsonify, Blueprint, flash, url_for

from cdm_souffleur.model.code_mapping import ScoredConceptEncoder
from cdm_souffleur.services.authorization_service import *
from cdm_souffleur.services.import_source_codes_service import create_source_codes, load_codes_to_server, \
    create_concept_mapping, search

usagi_api = Blueprint('usagi_api', __name__)

@usagi_api.route('/api/import_source_codes', methods=['POST'])
@token_required
def create_codes(current_user):
    try:
        file_name = request.json['fileName']
        source_code_column = request.json['sourceCodeColumn']
        source_name_column = request.json['sourceNameColumn']
        source_frequency_column = request.json['sourceFrequencyColumn']
        auto_concept_id_column = request.json['autoConceptIdColumn']
        additional_info_columns = request.json['additionalInfoColumns']
        concept_ids_or_atc = request.json['conceptIdsOrAtc']
        result = create_concept_mapping(current_user, file_name, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns)
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
        search_result = search(term)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return json.dumps(search_result, indent=4, cls=ScoredConceptEncoder)