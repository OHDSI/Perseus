import os
import traceback
from pathlib import Path

from flask import Blueprint, after_this_request
from flask import request, jsonify, send_from_directory
from peewee import ProgrammingError
from werkzeug.exceptions import BadRequestKeyError
from app import app
from config import APP_PREFIX
from services import source_schema_service, scan_reports_service, \
    etl_mapping_service, etl_archive_service, lookup_service, cache_service
from services.cdm_schema import get_exist_version, get_schema
from services.request import generate_etl_archive_request, \
    scan_report_request, lookup_request, set_cdm_version_request
from services.response import lookup_list_item_response
from services.response.etl_mapping_response import to_etl_mapping_response
from services.response.upload_scan_report_response import to_upload_scan_report_response
from services import xml_writer
from services.data_connection import databricks
from utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, CDM_XML_ARCHIVE_FORMAT
from utils.exceptions import InvalidUsage
from utils.info_response import info_response
from utils.username_header import username_header

perseus = Blueprint('perseus', __name__, url_prefix=APP_PREFIX)


@perseus.route('/api/info', methods=['GET'])
def get_app_version():
    app.logger.info("REST request to GET app info")
    return info_response()


@perseus.route('/api/upload_scan_report', methods=['POST'])
@username_header
def upload_scan_report(current_user):
    app.logger.info("REST request to upload WR scan report")
    file = request.files['scanReportFile']
    cdm_version = request.form.get('cdmVersion', None)
    cache_service.release_resource_if_used(current_user)
    filename, content_type, path = scan_reports_service.store_scan_report(file, current_user)
    etl_mapping = etl_mapping_service.create_etl_mapping(current_user, cdm_version)
    try:
        saved_schema = source_schema_service\
            .create_source_schema_by_scan_report(current_user, etl_mapping.id, filename)
        file_save_response = scan_reports_service\
            .load_scan_report_to_file_manager(filename, content_type, current_user)
        etl_mapping = etl_mapping_service.set_scan_report_info(etl_mapping.id, file_save_response)
        return jsonify(to_upload_scan_report_response(etl_mapping, saved_schema))
    except Exception as error:
        path.unlink()
        etl_mapping_service.delete_etl_mapping(etl_mapping.id)
        raise error


@perseus.route('/api/upload_etl_mapping', methods=['POST'])
@username_header
def upload_etl_mapping(current_user):
    """Create source schema by source tables from ETL mapping"""
    app.logger.info("REST request to create source schema")
    etl_archive = request.files['etlArchiveFile']
    cache_service.release_resource_if_used(current_user)
    return jsonify(etl_archive_service.upload_etl_archive(etl_archive, current_user))


@perseus.route('/api/create_source_schema_by_scan_report', methods=['POST'])
@username_header
def create_source_schema_by_scan_report(current_user):
    """Create source schema by ScanReportRequest"""
    app.logger.info("REST request to upload scan report from file manager and create source schema")
    scan_report_req = scan_report_request.from_json(request.json)
    cache_service.release_resource_if_used(current_user)
    path = scan_reports_service.load_scan_report_from_file_manager(scan_report_req, current_user)
    etl_mapping = etl_mapping_service.create_etl_mapping_by_request(current_user, scan_report_req)
    try:
        saved_schema = source_schema_service \
            .create_source_schema_by_scan_report(current_user, etl_mapping.id, etl_mapping.scan_report_name)
    except Exception as error:
        etl_mapping_service.delete_etl_mapping(etl_mapping.id)
        path.unlink()
        raise error
    return jsonify(to_upload_scan_report_response(etl_mapping, saved_schema))


@perseus.route('/api/etl-mapping/cdm-version', methods=['PATCH'])
@username_header
def set_cdm_version_to_etl_mapping(current_user):
    app.logger.info("REST request set CDM version to ETL mapping")
    req = set_cdm_version_request.from_json(request.get_json())
    result = etl_mapping_service.set_cdm_version(req, current_user)
    return jsonify(to_etl_mapping_response(result))


@perseus.route('/api/generate_etl_mapping_archive', methods=['POST'])
@username_header
def generate_etl_mapping_archive(current_user):
    app.logger.info("REST request to generate ETL mapping archive")
    request_body = generate_etl_archive_request.from_json(request.get_json())
    directory, filename = etl_archive_service.generate_etl_archive(request_body, current_user)

    @after_this_request
    def remove_generated_file(response):
        try:
            os.remove(Path(directory, filename))
        except Exception as e:
            app.logger.error("Can not remove downloaded file", e)
        return response

    return send_from_directory(directory, filename, download_name=filename.replace('.zip', '.etl'))


@perseus.route('/api/view_sql', methods=['POST'])
@username_header
def get_view(current_user):
    app.logger.info("REST request to get view sql table info")
    try:
        view_sql = request.get_json()['sql']
        view_result = source_schema_service.check_view_sql_and_return_columns_info(current_user, view_sql)
        return jsonify(view_result)
    except ProgrammingError as error:
        raise InvalidUsage(f"Syntax error in passed to view SQL: {error.__str__()}", 400, base=error)


@perseus.route('/api/validate_sql', methods=['POST'])
@username_header
def validate_sql(current_user):
    app.logger.info("REST request to validate sql function")
    try:
        sql_transformation = request.get_json()['sql']
        source_schema_service.run_sql_transformation(current_user, sql_transformation)
        return '', 204
    except ProgrammingError as error:
        raise InvalidUsage(f"Syntax error in passed SQL: {error.__str__()}", 400, base=error)


@perseus.route('/api/get_cdm_versions')
@username_header
def get_cdm_versions_call(current_user):
    """return available CDM versions schema list"""
    app.logger.info("REST request to get CDM versions")
    return jsonify(get_exist_version())


@perseus.route('/api/get_cdm_schema')
@username_header
def get_cdm_schema_call(current_user):
    """return CDM schema for target version"""
    app.logger.info("REST request to get CDM schema")
    cdm_version = request.args['cdm_version']
    cdm_schema = get_schema(cdm_version)
    return jsonify([s.to_json() for s in cdm_schema])


@perseus.route('/api/get_column_info')
@username_header
def get_column_info_call(current_user):
    """return top 10 values by freq for table and row(optionally)
    based on WR report
    """
    app.logger.info("REST request to get column info")
    try:
        table_name = request.args['table_name']
        column_name = request.args.get('column_name')
        etl_mapping_id = request.args.get('etl_mapping_id')
        info = source_schema_service.get_column_info(current_user, etl_mapping_id, table_name, column_name)
        return jsonify(info)
    except InvalidUsage as e:
        raise InvalidUsage(f'Info cannot be loaded due to not standard structure of report: {e.__str__()}', 400, base=e)
    except FileNotFoundError as e:
        raise InvalidUsage(f'Report not found: {e.__str__()}', 404, base=e)


@perseus.route('/api/xml_preview', methods=['POST'])
@username_header
def generate_xml_preview(current_user):
    app.logger.info("REST request to get XML preview")
    json = request.get_json()
    xml = xml_writer.get_xml(current_user, json)
    xml_writer.clear(current_user)

    return jsonify(xml)


@perseus.route('/api/generate_zip_xml', methods=['POST'])
@username_header
def generate_zip_xml(current_user):
    app.logger.info("REST request to generate zip XML")

    json = request.get_json()
    filename = f"{GENERATE_CDM_XML_ARCHIVE_FILENAME}.{CDM_XML_ARCHIVE_FORMAT}"
    xml_writer.get_xml(current_user, json)
    xml_writer.zip_xml(current_user, filename)
    xml_writer.clear(current_user)

    directory = Path(GENERATE_CDM_XML_ARCHIVE_PATH, current_user)

    @after_this_request
    def remove_generated_file(response):
        try:
            os.remove(Path(directory, filename))
        except Exception as e:
            app.logger.error("Error removing downloaded file", e)
        return response

    return send_from_directory(
        directory=directory,
        path=filename,
        as_attachment=True,
        download_name = filename
    )


@perseus.route('/api/lookup/sql')
def get_lookup_sql():
    app.logger.info("REST request to get lookup sql")
    id = request.args.get('id', None, int)
    name = request.args.get('name', None, str)
    lookup_type = request.args.get('lookupType', None, str)
    if lookup_type is None:
        raise InvalidUsage('Lookup type not specified', 400)
    lookup = lookup_service.get_lookup_sql(id, name, lookup_type)
    return jsonify(lookup)


@perseus.route('/api/lookups')
@username_header
def get_lookups(current_user):
    app.logger.info("REST request to get lookup list")
    lookup_type = request.args['lookupType']
    lookups_list = lookup_service.get_lookups(lookup_type, current_user)
    return jsonify(lookups_list)


@perseus.route('/api/lookup', methods=['POST'])
@username_header
def create_lookup(current_user):
    app.logger.info("REST request to create lookup")
    lookup_req = lookup_request.from_json(request.json)
    lookup = lookup_service.create_lookup(current_user, lookup_req)
    return jsonify(lookup_list_item_response.from_user_defined_lookup(lookup))


@perseus.route('/api/lookup', methods=['PUT'])
@username_header
def update_lookup(current_user):
    app.logger.info("REST request to create lookup")
    id = request.args.get('id', None, int)
    if id is None:
        raise InvalidUsage('Can not extract lookup id', 400)
    lookup_req = lookup_request.from_json(request.json)
    lookup = lookup_service.update_lookup(current_user, id, lookup_req)
    return jsonify(lookup_list_item_response.from_user_defined_lookup(lookup))


@perseus.route('/api/lookup', methods=['DELETE'])
@username_header
def delete_lookup(current_user):
    app.logger.info("REST request to delete lookup")
    id = request.args['id']
    lookup_service.del_lookup(current_user, int(id))
    return '', 204


@perseus.route('/api/get_user_schema_name', methods=['GET'])
@username_header
def get_schema_name(current_user):
    app.logger.info("REST request to get user schema name")
    return jsonify(current_user)


@perseus.route('/api/get_field_type', methods=['GET'])
def get_field_type_call():
    app.logger.info("REST request to get field type")
    type = request.args['type']
    result_type = source_schema_service.get_field_type(type)
    return jsonify(result_type)

@perseus.route('/api/data-connection/databricks/test-connection', methods=['POST'])
def data_connection_databricks_test_connection():
    results = databricks.test_connection(
        server_hostname=request.json['server'],
        http_path=request.json['path'],
        access_token=request.json.get('token', None),
    )
    return jsonify(results)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    app.logger.error(error.message)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(BadRequestKeyError)
def handle_bad_request_key(error):
    app.logger.error(error.__str__())
    response = jsonify({'message': error.__str__()})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(KeyError)
def handle_invalid_req_key(error):
    app.logger.error(error.__str__())
    response = jsonify({'message': f'{error.__str__()} missing'})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(Exception)
def handle_exception(error):
    app.logger.error(f'{request.url} request returned error: {error.__str__()}')
    response = jsonify({'message': error.__str__()})
    if hasattr(error, 'code'):
        response.status_code = error.code
    else:
        traceback.print_tb(error.__traceback__)
        response.status_code = 500
    return response
