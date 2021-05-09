import json
import subprocess
import urllib

import pysolr
from flask import request, jsonify, Blueprint, flash, url_for

from cdm_souffleur.model.code_mapping import ScoredConceptEncoder
from cdm_souffleur.services.authorization_service import *
from cdm_souffleur.services.import_source_codes_service import create_source_codes, load_codes_to_server, \
    create_concept_mapping, search, create_core

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
        search_result = search(current_user, term)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return json.dumps(search_result, indent=4, cls=ScoredConceptEncoder)


@usagi_api.route('/api/test_solr', methods=['GET'])
def test_solr_call():
    try:
        solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/",
                           always_commit=True)
        solr.ping()
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(True)


@usagi_api.route('/api/solr_import_status', methods=['GET'])
def solr_import_status_call():
    try:
        resource = urllib.request.urlopen('http://localhost:8983/solr/concepts/dataimport?command=status&indent=on&wt=json')
        content = resource.read().decode(resource.headers.get_content_charset())
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(content)


@usagi_api.route('/api/solr_import_data', methods=['GET'])
def solr_import_data_call():
    try:
        test = urllib.request.urlopen('http://localhost:8983/solr/admin/cores?action=CREATE&name=concepts&instanceDir=concepts&config=solrconfig.xml&dataDir=data')
        resource = urllib.request.urlopen('http://localhost:8983/solr/concepts/dataimport?command=full-import')
        content = resource.read().decode(resource.headers.get_content_charset())
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(content)


@usagi_api.route('/api/start_solr', methods=['GET'])
def start_solr_call():
    try:
        bashCmd = ["../solr-8.8.1/bin/solr", "start"]
        process = subprocess.Popen(bashCmd, stdout=subprocess.PIPE)
        output, error = process.communicate()
        print(output)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(True)
