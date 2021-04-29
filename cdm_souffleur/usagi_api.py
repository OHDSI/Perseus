from flask import request, jsonify, Blueprint, flash, url_for
from cdm_souffleur.services.authorization_service import *
from cdm_souffleur.services.source_codes_service import create_source_codes, load_codes_to_server, test_solr

usagi_api = Blueprint('usagi_api', __name__)

@usagi_api.route('/api/create_source_codes', methods=['POST'])
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
        create_source_codes(current_user, file_name, source_code_column, source_name_column, source_frequency_column, auto_concept_id_column, concept_ids_or_atc, additional_info_columns)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(True)


@usagi_api.route('/api/load_codes_to_server', methods=['POST'])
@token_required
def load_codes_call(current_user):
    """save schema to server and load it from server in the same request"""
    try:
        file = request.files['file']
        codes_file = load_codes_to_server(file, current_user)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(codes_file)

@usagi_api.route('/api/test_solr', methods=['GET'])
def test_solr_call():
    """save schema to server and load it from server in the same request"""
    try:
        test_solr()
    except Exception as error:
        raise InvalidUsage('Codes were not loaded', 500)
    return jsonify('OK')