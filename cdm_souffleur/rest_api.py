from cdm_souffleur.utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT, \
    UPLOAD_SOURCE_SCHEMA_FOLDER, VOCABULARY_FILTERS
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from cdm_souffleur.services.xml_writer import get_xml, zip_xml, \
    delete_generated_xml, get_lookups_sql, delete_generated_sql, get_lookups_list, get_lookup, add_lookup, del_lookup
from _thread import start_new_thread
from cdm_souffleur.model.detector import find_domain, load_vocabulary, \
    return_lookup_list, return_domain_list, return_concept_class_list
from cdm_souffleur.services.source_schema import load_report, get_source_schema, \
    get_existing_source_schemas_list, get_top_values, extract_sql, load_schema_to_server, \
    load_saved_source_schema_from_server, save_source_schema_in_db, get_view_from_db, run_sql_transformation, get_column_info
from cdm_souffleur.services.cdm_schema import get_exist_version, get_schema
from cdm_souffleur.utils.exceptions import InvalidUsage
import traceback
from werkzeug.exceptions import BadRequestKeyError
import os
from flask import Blueprint
from cdm_souffleur.vocab_search_api import vocab_search_api
from cdm_souffleur.authorization_api import authorization_api
from cdm_souffleur.model.user import *

CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_SOURCE_SCHEMA_FOLDER
app.secret_key = 'mdcr'

bp = Blueprint('bp', __name__, url_prefix=app.config["CDM_SOUFFLEUR_PREFIX"])

@bp.route('/api/load_schema', methods=['GET', 'POST'])
@token_required
def load_schema(current_user):
    """save source schema to server side"""
    if request.method == 'POST':
        file = request.files['file']
        load_schema_to_server(file, current_user)
    return jsonify(success=True)


@bp.route('/api/load_saved_source_schema', methods=['GET'])
@token_required
def load_saved_source_schema_call(current_user):
    """load saved source schema by name"""
    schema_name = request.args['schema_name']
    saved_schema = load_saved_source_schema_from_server(current_user, schema_name)
    if saved_schema is not None:
        return jsonify([s.to_json() for s in saved_schema])
    else:
        raise InvalidUsage('Schema was not loaded', 404)


@bp.route(f'/api/save_and_load_schema', methods=['GET', 'POST'])
@token_required
def save_and_load_schema_call(current_user):
    """save schema to server and load it from server in the same request"""
    delete_generated_xml(current_user)
    if request.method == 'POST':
        file = request.files['file']
        load_schema_to_server(file, current_user)
    saved_schema = load_saved_source_schema_from_server(current_user, file.filename)
    if saved_schema is not None:
        return jsonify([s.to_json() for s in saved_schema])
    else:
        raise InvalidUsage('Schema was not loaded', 404)

@bp.route(f'/api/load_schema_to_server', methods=['POST'])
@token_required
def load_schema_call(current_user):
    """save schema to server and load it from server in the same request"""
    try:
        file = request.files['file']
        load_schema_to_server(file, current_user)
    except Exception as error:
        raise InvalidUsage('Schema was not loaded', 404)
    return jsonify('OK')

@bp.route('/api/save_source_schema_to_db', methods=['POST'])
@token_required
def save_source_schema_to_db_call(current_user):
    try:
        source_tables = request.json
        save_source_schema_in_db(current_user, source_tables)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify('OK')

@bp.route('/api/get_view', methods=['POST'])
@token_required
def get_View(current_user):
    try:
        view_sql = request.get_json()
        view_result = get_view_from_db(current_user, view_sql['sql'])
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(view_result)

@bp.route('/api/validate_sql', methods=['POST'])
@token_required
def validate_Sql(current_user):
    try:
        sql_transformation = request.get_json()
        sql_result = run_sql_transformation(current_user, sql_transformation['sql'])
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(sql_result)


@bp.route('/api/get_cdm_versions')
@token_required
def get_cdm_versions_call(current_user):
    """return available CDM versions schema list"""
    return jsonify(get_exist_version())


@bp.route('/api/get_cdm_schema')
@token_required
def get_cdm_schema_call(current_user):
    """return CDM schema for target version"""
    cdm_version = request.args['cdm_version']
    cdm_schema = get_schema(cdm_version)
    return jsonify([s.to_json() for s in cdm_schema])


@bp.route('/api/get_column_info')
@token_required
def get_column_info_call(current_user):
    """return top 10 values by freq for table and row(optionally)
    based on WR report
    """
    table_name = request.args['table_name']
    column_name = request.args.get('column_name')
    report_name = request.args.get('report_name')
    info = get_column_info(current_user, report_name, table_name, column_name);
    if not info:
        raise InvalidUsage('Info cannot be loaded due to not standard structure of report', 400)
    else:
        return jsonify(info)

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """handle error of wrong usage on functions"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(BadRequestKeyError)
def handle_invalid_req_key(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': error.__str__()})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(KeyError)
def handle_invalid_req_key_header(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': f'{error.__str__()} missing'})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@bp.route('/api/get_xml', methods=['POST'])
@token_required
def xml(current_user):
    """return XML for CDM builder in map {source_table: XML, } and
    create file on back-end
    """
    json = request.get_json()
    xml_ = get_xml(current_user, json)
    return jsonify(xml_)


@bp.route('/api/get_zip_xml')
@token_required
def zip_xml_call(current_user):
    """return attached ZIP of XML's from back-end folder
    TODO  - now the folder is not cleared
    """
    try:
        zip_xml(current_user)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return send_from_directory(
        f"{GENERATE_CDM_XML_ARCHIVE_PATH}/{current_user}",
        filename='.'.join((GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT)),
        as_attachment=True
    )


@bp.route('/api/get_lookup')
@token_required
def get_lookup_by_name(current_user):
    name = request.args['name']
    lookup_type = request.args['lookupType']
    lookup = get_lookup(current_user, name, lookup_type)
    return jsonify(lookup)

@bp.route('/api/get_lookups_list')
@token_required
def get_lookups(current_user):
    lookup_type = request.args['lookupType']
    lookups_list = get_lookups_list(current_user, lookup_type)
    return jsonify(lookups_list)

@bp.route('/api/save_lookup', methods=['POST'])
@token_required
def save_lookup(current_user):
    try:
        lookup = request.json
        add_lookup(current_user, lookup)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 400)
    return jsonify(success=True)

@bp.route('/api/delete_lookup', methods=['DELETE'])
@token_required
def delete_lookup(current_user):
    try:
        name = request.args['name']
        lookup_type = request.args['lookupType']
        del_lookup(current_user, name, 'source_to_standard')
        del_lookup(current_user, name, 'source_to_source')
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(success=True)

app.register_blueprint(bp)
app.register_blueprint(vocab_search_api)
app.register_blueprint(authorization_api)
if __name__ == '__main__':
    # app.run(debug=True)

    app.run(port=app.config["CDM_SOUFFLEUR_PORT"])

