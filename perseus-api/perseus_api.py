import traceback

from flask import Blueprint
from flask import request, jsonify, send_from_directory
from peewee import ProgrammingError
from werkzeug.exceptions import BadRequestKeyError

from app import app
from config import VERSION, APP_PREFIX
from services import source_schema_service, scan_reports_service, \
    etl_mapping_service, etl_archive_service, lookup_service
from services.cdm_schema import get_exist_version, get_schema
from services.request import generate_etl_archive_request, \
    scan_report_request, lookup_request
from services.response import lookup_list_item_response
from services.response.upload_scan_report_response import to_upload_scan_report_response
from services import xml_writer
from utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, CDM_XML_ARCHIVE_FORMAT
from utils.exceptions import InvalidUsage
from utils.utils import username_header

perseus = Blueprint('perseus', __name__, url_prefix=APP_PREFIX)


@perseus.route('/api/info', methods=['GET'])
def get_app_version():
    app.logger.info("REST request to GET app info")
    return jsonify({'name': 'Perseus', 'version': VERSION})


@perseus.route('/api/upload_scan_report', methods=['POST'])
@username_header
def upload_scan_report(current_user):
    app.logger.info("REST request to upload WR scan report")
    try:
        scan_report_file = request.files['scanReportFile']
        file_save_response = scan_reports_service.load_scan_report_to_server(scan_report_file, current_user)
        saved_schema = source_schema_service.create_source_schema_by_scan_report(current_user, scan_report_file.filename)
        etl_mapping = etl_mapping_service.create_etl_mapping_by_file_save_resp(current_user, file_save_response)
        return jsonify(to_upload_scan_report_response(etl_mapping, saved_schema))
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f"Unable to upload WR scan report: {error.__str__()}", 500)


@perseus.route('/api/upload_etl_mapping', methods=['POST'])
@username_header
def upload_etl_mapping(current_user):
    """Create source schema by source tables from ETL mapping"""
    app.logger.info("REST request to create source schema")
    try:
        etl_archive = request.files['etlArchiveFile']
        return jsonify(etl_archive_service.upload_etl_archive(etl_archive, current_user))
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f"Unable to create source schema by source \
                            tables from ETL mapping: {error.__str__()}", 500)


@perseus.route('/api/create_source_schema_by_scan_report', methods=['POST'])
@username_header
def create_source_schema_by_scan_report(current_user):
    """Create source schema by ScanReportRequest"""
    app.logger.info("REST request to upload scan report from file manager and create source schema")
    try:
        scan_report = scan_report_request.from_json(request.json)
        scan_reports_service.load_scan_report_from_file_manager(scan_report, current_user)
        saved_schema = source_schema_service.create_source_schema_by_scan_report(current_user, scan_report.file_name)
        etl_mapping = etl_mapping_service.create_etl_mapping_from_request(current_user, scan_report)
        return jsonify(to_upload_scan_report_response(etl_mapping, saved_schema))
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)


@perseus.route('/api/generate_etl_mapping_archive', methods=['POST'])
@username_header
def generate_etl_mapping_archive(current_user):
    app.logger.info("REST request to generate ETL mapping archive")
    try:
        request_body = generate_etl_archive_request.from_json(request.get_json())
        result = etl_archive_service.generate_etl_archive(request_body, current_user)
        download_name=result[1].replace('.zip', '.etl')
        return send_from_directory(result[0], result[1], download_name=download_name)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f"Unable to  generate ETL mapping archive: {error.__str__()}", 500)


@perseus.route('/api/get_view', methods=['POST'])
@username_header
def get_view(current_user):
    app.logger.info("REST request to get view")
    try:
        view_sql = request.get_json()
        view_result = source_schema_service.get_view_from_db(current_user, view_sql['sql'])
    except ProgrammingError as error:
        raise InvalidUsage(f"Syntax error in passed to view SQL: {error.__str__()}", 400)
    except Exception as error:
        raise InvalidUsage(f"Unable to get view: {error.__str__()}", 500)
    return jsonify(view_result)


@perseus.route('/api/validate_sql', methods=['POST'])
@username_header
def validate_sql(current_user):
    app.logger.info("REST request to validate sql")
    try:
        sql_transformation = request.get_json()
        sql_result = source_schema_service.run_sql_transformation(current_user, sql_transformation['sql'])
    except ProgrammingError as error:
        raise InvalidUsage(f"Syntax error in passed SQL: {error.__str__()}", 400)
    except Exception as error:
        raise InvalidUsage(f"Cound not validate passed SQL: {error.__str__()}", 500)
    return jsonify(sql_result)


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
        info = source_schema_service.get_column_info(current_user, etl_mapping_id, table_name, column_name);
    except InvalidUsage as e:
        raise InvalidUsage(f'Info cannot be loaded due to not standard structure of report: {e.__str__()}', 400)
    except FileNotFoundError as e:
        raise InvalidUsage(f'Report not found: {e.__str__()}', 404)
    except Exception as e:
        raise InvalidUsage(f"Could not get report column info: {e.__str__()}", 500)
    return jsonify(info)


@perseus.route('/api/xml_preview', methods=['POST'])
@username_header
def xml(current_user):
    app.logger.info("REST request to get XML preview")
    json = request.get_json()
    xml_ = xml_writer.get_xml(current_user, json)
    xml_writer.clear(current_user)

    return jsonify(xml_)


@perseus.route('/api/generate_zip_xml', methods=['POST'])
@username_header
def zip_xml_call(current_user):
    app.logger.info("REST request to generate zip XML")
    try:
        json = request.get_json()
        xml_writer.get_xml(current_user, json)
        xml_writer.zip_xml(current_user)
        xml_writer.clear(current_user)
    except Exception as error:
        raise InvalidUsage(f"Could not zip XML: {error.__str__()}", 404)
    return send_from_directory(
        directory=f"{GENERATE_CDM_XML_ARCHIVE_PATH}/{current_user}",
        path=f"{GENERATE_CDM_XML_ARCHIVE_FILENAME}.{CDM_XML_ARCHIVE_FORMAT}",
        as_attachment=True
    )


@perseus.route('/api/lookup/sql')
def get_lookup_sql():
    app.logger.info("REST request to get lookup sql")
    id = request.args.get('id', None, int)
    name = request.args.get('name', None, str)
    lookup_type = request.args.get('lookupType', None, str)
    if lookup_type is None:
        raise InvalidUsage('Can not extract lookup type', 400)
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
    try:
        lookup_req = lookup_request.from_json(request.json)
        lookup = lookup_service.create_lookup(current_user, lookup_req)
        return jsonify(lookup_list_item_response.from_user_defined_lookup(lookup))
    except Exception as error:
        raise InvalidUsage(f"Could not create lookup: {error.__str__()}", 500)


@perseus.route('/api/lookup', methods=['PUT'])
@username_header
def update_lookup(current_user):
    app.logger.info("REST request to create lookup")
    try:
        id = request.args.get('id', None, int)
        if id is None:
            raise InvalidUsage('Can not extract lookup id', 400)
        lookup_req = lookup_request.from_json(request.json)
        lookup = lookup_service.update_lookup(current_user, id, lookup_req)
        return jsonify(lookup_list_item_response.from_user_defined_lookup(lookup))
    except Exception as error:
        raise InvalidUsage(f"Could not update lookup: {error.__str__()}", 500)


@perseus.route('/api/lookup', methods=['DELETE'])
@username_header
def delete_lookup(current_user):
    app.logger.info("REST request to delete lookup")
    try:
        id = request.args['id']
        lookup_service.del_lookup(current_user, int(id))
    except Exception as error:
        raise InvalidUsage(f"Could not delete lookup: {error.__str__()}", 500)
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


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    app.logger.error(error.message)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
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
    app.logger.error(error.__str__())
    response = jsonify({'message': error.__str__()})
    response.status_code = 500
    traceback.print_tb(error.__traceback__)
    return response
