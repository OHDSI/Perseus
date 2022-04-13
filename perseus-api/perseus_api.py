import traceback
from flask import Blueprint, request, jsonify, send_from_directory
from peewee import ProgrammingError
from werkzeug.exceptions import BadRequestKeyError

from app import app
from config import VERSION, APP_PREFIX
from services.etl_archive_service import upload_etl_archive,\
                                         generate_etl_archive
from services.etl_mapping_service import create_etl_mapping_by_file_save_resp,\
                                         create_etl_mapping_from_request
from services.scan_reports_service import load_scan_report_from_file_manager,\
                                          load_scan_report_to_server
from services.source_schema_service import run_sql_transformation,\
                                           get_column_info,\
                                           get_field_type,\
                                           get_view_from_db
from services.request import generate_etl_archive_request,\
                             scan_report_request
from services.response.upload_scan_report_response import to_upload_scan_report_response
from services.xml_writer import get_xml, zip_xml,\
                                delete_generated_xml,\
                                get_lookups_list,\
                                get_lookup, add_lookup,\
                                del_lookup
from services.cdm_schema import get_exist_version, get_schema
from utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH,\
                            GENERATE_CDM_XML_ARCHIVE_FILENAME,\
                            CDM_XML_ARCHIVE_FORMAT
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
        delete_generated_xml(current_user)
        scan_report_file = request.files['scanReportFile']
        file_save_response = load_scan_report_to_server(scan_report_file, current_user)
        saved_schema = create_source_schema_by_scan_report(current_user, scan_report_file.filename)
        etl_mapping = create_etl_mapping_by_file_save_resp(current_user, file_save_response)
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
        delete_generated_xml(current_user)
        etl_archive = request.files['etlArchiveFile']
        return jsonify(upload_etl_archive(etl_archive, current_user))
    except InvalidUsage as error:
        raise error
    except Exception as error:
        app.logger.error(error.__str__())
        raise InvalidUsage(f"Unable to create source schema by source \
                            tables from ETL mapping: {error.__str__()}", 500)


@perseus.route('/api/create_source_schema_by_scan_report', methods=['POST'])
@username_header
def create_source_schema_by_scan_report(current_user):
    """Create source schema by ScanReportRequest"""
    app.logger.info("REST request to upload scan report from file manager and create source schema")
    try:
        scan_report = scan_report_request.from_json(request.json)
        load_scan_report_from_file_manager(scan_report, current_user)
        saved_schema = create_source_schema_by_scan_report(current_user, scan_report.file_name)
        etl_mapping = create_etl_mapping_from_request(current_user, scan_report)
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
        result = generate_etl_archive(request_body, current_user)
        download_name=result[1].replace('.zip', '.etl')
        return send_from_directory(result[0], result[1], download_name=download_name)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        app.logger.error(error.__str__())
        raise InvalidUsage(f"Unable to  generate ETL mapping archive: {error.__str__()}", 500)


@perseus.route('/api/get_view', methods=['POST'])
@username_header
def get_view(current_user):
    app.logger.info("REST request to get view")
    try:
        view_sql = request.get_json()
        view_result = get_view_from_db(current_user, view_sql['sql'])
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
        sql_result = run_sql_transformation(current_user, sql_transformation['sql'])
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
        report_name = request.args.get('report_name')
        info = get_column_info(current_user, report_name, table_name, column_name);
    except InvalidUsage:
        raise InvalidUsage('Info cannot be loaded due to not standard structure of report', 400)
    except FileNotFoundError:
        raise InvalidUsage('Report not found', 404)
    except Exception as e:
        raise InvalidUsage(f"Could not get report column info: {e.__str__()}", 500)
    return jsonify(info)


@perseus.route('/api/get_xml', methods=['POST'])
@username_header
def xml(current_user):
    """return XML for CDM builder in map {source_table: XML, } and
    create file on back-end
    """
    app.logger.info("REST request to get XML")
    json = request.get_json()
    xml_ = get_xml(current_user, json)
    return jsonify(xml_)


@perseus.route('/api/get_zip_xml')
@username_header
def zip_xml_call(current_user):
    """return attached ZIP of XML's from back-end folder
    TODO  - now the folder is not cleared
    """
    app.logger.info("REST request to get zip XML")
    try:
        zip_xml(current_user)
    except Exception as error:
        raise InvalidUsage(f"Could not zip XML: {error.__str__()}", 404)
    return send_from_directory(
        directory=f"{GENERATE_CDM_XML_ARCHIVE_PATH}/{current_user}",
        path=f"{GENERATE_CDM_XML_ARCHIVE_FILENAME}.{CDM_XML_ARCHIVE_FORMAT}",
        as_attachment=True
    )


@perseus.route('/api/get_lookup')
@username_header
def get_lookup_by_name(current_user):
    app.logger.info("REST request to get lookup")
    name = request.args['name']
    lookup_type = request.args['lookupType']
    lookup = get_lookup(current_user, name, lookup_type)
    return jsonify(lookup)


@perseus.route('/api/get_lookups_list')
@username_header
def get_lookups(current_user):
    app.logger.info("REST request to get lookup list")
    lookup_type = request.args['lookupType']
    lookups_list = get_lookups_list(current_user, lookup_type)
    return jsonify(lookups_list)


@perseus.route('/api/save_lookup', methods=['POST'])
@username_header
def save_lookup(current_user):
    app.logger.info("REST request to save lookup")
    try:
        lookup = request.json
        add_lookup(current_user, lookup)
    except Exception as error:
        raise InvalidUsage(f"Could not save lookup: {error.__str__()}", 500)
    return jsonify(success=True)


@perseus.route('/api/delete_lookup', methods=['DELETE'])
@username_header
def delete_lookup(current_user):
    app.logger.info("REST request to delete lookup")
    try:
        name = request.args['name']
        del_lookup(current_user, name, 'source_to_standard')
        del_lookup(current_user, name, 'source_to_source')
    except Exception as error:
        raise InvalidUsage(f"Could not delete lookup: {error.__str__()}", 500)
    return jsonify(success=True)


@perseus.route('/api/get_user_schema_name', methods=['GET'])
@username_header
def get_schema_name(current_user):
    app.logger.info("REST request to get user schema name")
    return jsonify(current_user)


@perseus.route('/api/get_field_type', methods=['GET'])
@username_header
def get_field_type_call(current_user):
    app.logger.info("REST request to get field type")
    field_type = request.args['type']
    result_type = get_field_type(field_type)
    return jsonify(result_type)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """handle error of wrong usage on functions"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(BadRequestKeyError)
def handle_bad_request_key(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': error.__str__()})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(KeyError)
def handle_invalid_req_key(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': f'{error.__str__()} missing'})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(Exception)
def handle_exception(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': error.__str__()})
    response.status_code = 500
    traceback.print_tb(error.__traceback__)
    return response
