import http
import json
import os
import traceback

from flask import jsonify, Blueprint, request, after_this_request
from app import app
from config import APP_PREFIX, VERSION
from model.usagi.conversion_status import ConversionStatus
from model.usagi_data.code_mapping import ScoredConceptEncoder
from service.code_mapping_conversion_service import get_conversion_by_username, update_conversion, create_conversion
from service.code_mapping_log_service import get_logs
from service.code_mapping_snapshot_service import get_snapshots_name_list, get_snapshot, delete_snapshot
from service.filters_service import get_filters
from service.search_service import search_usagi
from service.source_to_concept_map_service import delete_source_to_concept_by_snapshot_name
from service.usagi_service import get_concept_mapping_result, create_concept_mapping, extract_codes_from_csv, \
    save_concept_mapping_result
from util.async_directive import cancel_concept_mapping_task
from util.code_mapping_conversion_util import code_mapping_conversion_to_json
from util.constants import QUERY_SEARCH_MODE
from util.conversion_id import get_conversion_id
from util.exception import InvalidUsage
from util.utils import username_header

usagi = Blueprint('usagi', __name__, url_prefix=APP_PREFIX)


@usagi.route('/api/info', methods=['GET'])
def app_version():
    app.logger.info("REST request to GET app info")
    return jsonify({'name': 'Usagi', 'version': VERSION})


@usagi.route('/api/code-mapping/load-csv', methods=['POST'])
@username_header
def load_csv_for_code_mapping_conversion(current_user):
    app.logger.info("REST request to load CSV file for Code Mapping conversion")
    file = request.files['file']
    delimiter = request.form['delimiter']
    source_codes, file_path = extract_codes_from_csv(file, delimiter, current_user)

    @after_this_request
    def remove_generated_file(response):
        try:
            os.remove(file_path)
        except Exception as e:
            app.logger.error("Error removing downloaded file", e)
        return response

    return jsonify(source_codes)


@usagi.route('/api/code-mapping/launch', methods=['POST'])
@username_header
def launch_code_mapping_conversion(current_user):
    app.logger.info("REST request to launch Code Mapping Conversion")
    params = request.json['params']
    source_code_column = params['sourceCode']
    source_name_column = params['sourceName']
    source_frequency_column = params['sourceFrequency']
    auto_concept_id_column = params['autoConceptId']
    additional_info_columns = params['additionalInfo']
    concept_ids_or_atc = params['columnType']
    codes = request.json['codes']
    filters = request.json['filters']
    conversion = create_conversion(current_user)
    create_concept_mapping(current_user,
                           conversion,
                           codes,
                           filters,
                           source_code_column,
                           source_name_column,
                           source_frequency_column,
                           auto_concept_id_column,
                           concept_ids_or_atc,
                           additional_info_columns)
    return jsonify(code_mapping_conversion_to_json(conversion))


@usagi.route('/api/code-mapping/status', methods=['GET'])
@username_header
def code_mapping_conversion_status(current_user):
    app.logger.info("REST request to GET Code Mapping conversion status")
    conversion_id = get_conversion_id(request)
    conversion = get_conversion_by_username(conversion_id, current_user)
    logs = get_logs(conversion)
    return jsonify({
        'id': conversion.id,
        'statusCode': conversion.status_code,
        'statusName': conversion.status_name,
        'logs': [log for log in logs]
    })


@usagi.route('/api/code-mapping/abort', methods=['GET'])
@username_header
def abort_code_mapping_conversion(current_user):
    app.logger.info("REST request to abort Code Mapping conversion")
    cancel_concept_mapping_task(current_user)
    conversion_id = get_conversion_id(request)
    conversion = get_conversion_by_username(conversion_id, current_user)
    update_conversion(conversion.id, ConversionStatus.ABORTED)
    return '', http.HTTPStatus.NO_CONTENT


@usagi.route('/api/code-mapping/result', methods=['GET'])
@username_header
def code_mapping_conversion_result(current_user):
    app.logger.info("REST request to GET Code Mapping conversion result")
    conversion_id = get_conversion_id(request)
    result = get_concept_mapping_result(conversion_id, current_user)
    return jsonify(result)


"""
Request body: {
    term: str
    sourceAutoAssignedConceptIds: int[]
    filters: {
        filterByUserSelectedConceptsAtcCode: bool
        filterStandardConcepts: bool
        includeSourceTerms: bool
        filterByConceptClass: bool
        conceptClasses: str[]
        filterByVocabulary: bool
        vocabularies: str[]
        filterByDomain: bool
        domains: str[]
        searchMode: 'term' | 'query'
        searchString: str
    }
}
"""
@usagi.route('/api/code-mapping/search-by-term', methods=['POST'])
def get_term_search_results_call():
    app.logger.info("REST request to search by term in Code Mapping conversion result")
    filters = request.json['filters']
    term = filters['searchString'] \
        if filters['searchMode'] == QUERY_SEARCH_MODE \
        else request.json['term']
    source_auto_assigned_concept_ids = request.json['sourceAutoAssignedConceptIds']
    search_result = search_usagi(filters, term, source_auto_assigned_concept_ids)
    return json.dumps(search_result, indent=4, cls=ScoredConceptEncoder)


@usagi.route('/api/code-mapping/save', methods=['POST'])
@username_header
def save_mapped_codes_call(current_user):
    app.logger.info("REST request to save code mapping conversion result")
    codes = request.json['codes']
    mapped_codes = request.json['codeMappings']
    snapshot_name = request.json['name']
    mapping_params = request.json['mappingParams']
    filters = request.json['filters']
    conversion_id = get_conversion_id(request)
    conversion = get_conversion_by_username(conversion_id, current_user)
    save_concept_mapping_result(current_user,
                                         codes,
                                         mapping_params,
                                         mapped_codes,
                                         filters,
                                         snapshot_name,
                                         conversion)
    return '', http.HTTPStatus.NO_CONTENT


@usagi.route('/api/snapshot/names', methods=['GET'])
@username_header
def snapshots_name_list_call(current_user):
    app.logger.info("REST request to GET snapshots name list")
    result = get_snapshots_name_list(current_user)
    return jsonify(result)


@usagi.route('/api/snapshot', methods=['GET'])
@username_header
def get_snapshot_call(current_user):
    app.logger.info("REST to GET snapshot")
    snapshot_name = request.args['name']
    result = get_snapshot(snapshot_name, current_user)
    return jsonify(result)


@usagi.route('/api/snapshot', methods=['DELETE'])
@username_header
def delete_snapshot_call(current_user):
    app.logger.info("REST request to DELETE snapshot")
    snapshot_name = request.args['name']
    delete_snapshot(snapshot_name, current_user)
    delete_source_to_concept_by_snapshot_name(snapshot_name, current_user)
    return '', http.HTTPStatus.NO_CONTENT


@usagi.route('/api/filters', methods=['GET'])
def get_filters_call():
    app.logger.info("REST request to GET filters")
    result = get_filters()
    return jsonify(result)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    app.logger.error(error.message)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(Exception)
def handle_exception(error):
    app.logger.error(error.__str__())
    response = jsonify({'message': error.__str__()})
    response.status_code = 500
    traceback.print_tb(error.__traceback__)
    return response