from cdm_souffleur.utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT, \
    UPLOAD_SOURCE_SCHEMA_FOLDER
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask import Blueprint
from cdm_souffleur.model.xml_writer import get_xml, zip_xml, \
    delete_generated_xml, get_lookups_sql, delete_generated_sql, get_lookups_list, get_lookup, add_lookup, del_lookup
from _thread import start_new_thread
from cdm_souffleur.model.detector import find_domain, load_vocabulary, \
    return_lookup_list, return_domain_list, return_concept_class_list
from cdm_souffleur.model.source_schema import load_report, get_source_schema, \
    get_existing_source_schemas_list, get_top_values, extract_sql, load_schema_to_server, \
    load_saved_source_schema_from_server, save_source_schema_in_db, get_view_from_db, run_sql_transformation, get_column_info
from cdm_souffleur.model.cdm_schema import get_exist_version, get_schema
from cdm_souffleur.utils.exceptions import InvalidUsage
import traceback
from werkzeug.exceptions import BadRequestKeyError
import os
from peewee import *
from flask import Blueprint

app = Flask(__name__)
app.config.from_object(f'config.{os.getenv("CDM_SOUFFLEUR_ENV").capitalize()}Config')
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_SOURCE_SCHEMA_FOLDER
app.secret_key = 'mdcr'

bp = Blueprint('bp', __name__, url_prefix=app.config["CDM_SOUFFLEUR_PREFIX"])

@bp.route('/api/load_schema', methods=['GET', 'POST'])
def load_schema():
    """save source schema to server side"""
    if request.method == 'POST':
        file = request.files['file']
        load_schema_to_server(file)
    return jsonify(success=True)


@bp.route('/api/get_existing_source_schemas_list', methods=['GET'])
def get_existing_source_schemas_list_call():
    """return list of saved source schemas"""
    return jsonify(
        get_existing_source_schemas_list(app.config['UPLOAD_FOLDER']))


@bp.route('/api/load_saved_source_schema', methods=['GET'])
def load_saved_source_schema_call():
    """load saved source schema by name"""
    schema_name = request.args['schema_name']
    saved_schema = load_saved_source_schema_from_server(schema_name)
    if saved_schema is not None:
        return jsonify([s.to_json() for s in saved_schema])
    else:
        raise InvalidUsage('Schema was not loaded', 404)


@bp.route(f'/api/save_and_load_schema', methods=['GET', 'POST'])
def save_and_load_schema_call():
    """save schema to server and load it from server in the same request"""
    delete_generated_xml() #remove Definitions directory
    if request.method == 'POST':
        file = request.files['file']
        load_schema_to_server(file)
    saved_schema = load_saved_source_schema_from_server(file.filename)
    if saved_schema is not None:
        return jsonify([s.to_json() for s in saved_schema])
    else:
        raise InvalidUsage('Schema was not loaded', 404)

@bp.route('/api/save_source_schema_to_db', methods=['POST'])
def save_source_schema_to_db_call():
    try:
        source_tables = request.json
        save_source_schema_in_db(source_tables)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify('OK')

@bp.route('/api/get_view', methods=['POST'])
def get_View():
    try:
        view_sql = request.get_json()
        view_result=get_view_from_db(view_sql['sql'])
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(view_result)

@bp.route('/api/validate_sql', methods=['POST'])
def validate_Sql():
    try:
        sql_transformation = request.get_json()
        sql_result = run_sql_transformation(sql_transformation['sql'])
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(sql_result)

@bp.route('/api/get_view', methods=['GET'])
def get_view_call():
    try:
        view_sql = request.args['sql']
        pg_db = PostgresqlDatabase('testdb', user='postgres', password='postgres',
                                   host='localhost', port=5432)
        sql_test='select * from additional as t1 join batchnumbers as t2'
        pg_db.connect()
        cursor = pg_db.execute_sql(view_sql)
        pg_db.close()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify('OK')

@bp.route('/api/delete_saved_source_schema', methods=['GET'])
def delete_saved_source_schema_call():
    """delete saved source schema by name"""
    schema_name = request.args['schema_name']
    if schema_name in get_existing_source_schemas_list(
            app.config['UPLOAD_FOLDER']):
        os.remove(app.config['UPLOAD_FOLDER'] / schema_name)
        return 'OK'
    else:
        raise InvalidUsage('Schema was not loaded', 404)


@bp.route('/api/get_cdm_versions')
def get_cdm_versions_call():
    """return available CDM versions schema list"""
    return jsonify(get_exist_version())


@bp.route('/api/get_cdm_schema')
def get_cdm_schema_call():
    """return CDM schema for target version"""
    cdm_version = request.args['cdm_version']
    cdm_schema = get_schema(cdm_version)
    return jsonify([s.to_json() for s in cdm_schema])


@bp.route('/api/get_source_schema')
def get_source_schema_call():
    """return with source schema based on White Rabbit report"""
    path = request.args['path']
    source_schema = get_source_schema(path)
    return jsonify([s.to_json() for s in source_schema])


@bp.route('/api/get_top_values')
def get_top_values_call():
    """return top 10 values by freq for table and row(optionally)
    based on WR report
    """
    table_name = request.args['table_name']
    column_name = request.args.get('column_name')
    return jsonify(get_top_values(table_name, column_name))

@bp.route('/api/get_column_info')
def get_column_info_call():
    """return top 10 values by freq for table and row(optionally)
    based on WR report
    """
    table_name = request.args['table_name']
    column_name = request.args.get('column_name')
    info = get_column_info(table_name, column_name);
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


@bp.route('/api/get_lookup_list')
def get_lookups_call():
    """return lookups list of ATHENA vocabulary"""
    lookups = return_lookup_list()
    return jsonify(lookups)


@bp.route('/api/get_domain_list')
def get_domains_call():
    """return domains list of ATHENA vocabulary"""
    domains = return_domain_list()
    return jsonify(domains)


@bp.route('/api/get_concept_class_list')
def get_concept_classes_call():
    """return concept class list of ATHENA vocabulary"""
    concept_classes = return_concept_class_list()
    return jsonify(concept_classes)


@bp.route('/api/get_xml', methods=['POST'])
def xml():
    """return XML for CDM builder in map {source_table: XML, } and
    create file on back-end
    """
    json = request.get_json()
    xml_ = get_xml(json)
    return jsonify(xml_)


@bp.route('/api/get_lookup_sql', methods=['POST'])
def get_lookup_sql_call():
    """generate sql's for lookups, also return to front"""
    json = request.get_json()
    sql_ = get_lookups_sql(json)
    return jsonify(sql_)


@bp.route('/api/get_zip_xml')
def zip_xml_call():
    """return attached ZIP of XML's from back-end folder
    TODO  - now the folder is not cleared
    """
    try:
        zip_xml()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return send_from_directory(
        GENERATE_CDM_XML_ARCHIVE_PATH,
        filename='.'.join((GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT)),
        as_attachment=True
    )


@bp.route('/api/clear_xml_dir')
def clear_xml_dir_call():
    """clear directory with mapping items"""
    try:
        delete_generated_xml()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return 'OK'


@bp.route('/api/clear_sql_dir')
def clear_sql_dir_call():
    """clear directory with lookup sql's items"""
    try:
        delete_generated_sql()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return 'OK'


@bp.route('/api/find_domain')
def find_domain_call():
    """load report and vocabulary before, return matched codes"""
    column_name = request.args['column_name']
    table_name = request.args['table_name']
    try:
        found_codes = find_domain(column_name, table_name).to_json(
            orient='records')
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(found_codes)


@bp.route('/api/get_generated_sql', methods=['GET'])
def get_sql_call():
    """return sql's from generated mapping"""
    source_table_name = request.args['source_table_name']
    sql = extract_sql(source_table_name)
    return jsonify(sql)


@bp.route('/api/load_report')
def load_report_call():
    """load report about source schema"""
    schema_name = request.args['schema_name']
    try:
        load_report(app.config['UPLOAD_FOLDER'] / schema_name)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return 'OK'


@bp.route('/api/load_vocabulary')
def load_vocabulary_call():
    """load vocabulary"""
    # TODO rewrite to threading instead _thread?
    path = request.args['path']
    start_new_thread(load_vocabulary, (path,))
    return 'OK'

@bp.route('/api/get_lookup')
def get_lookup_by_name():
    name = request.args['name']
    lookup_type = request.args['lookupType']
    lookup = get_lookup(name, lookup_type)
    return jsonify(lookup)

@bp.route('/api/get_lookups_list')
def get_lookups():
    lookup_type = request.args['lookupType']
    lookups_list = get_lookups_list(lookup_type)
    return jsonify(lookups_list)

@bp.route('/api/save_lookup', methods=['POST'])
def save_lookup():
    try:
        lookup = request.json
        add_lookup(lookup)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 400)
    return jsonify(success=True)

@bp.route('/api/delete_lookup', methods=['DELETE'])
def delete_lookup():
    try:
        name = request.args['name']
        lookup_type = request.args['lookupType']
        del_lookup(name, 'source_to_standard')
        del_lookup(name, 'source_to_source')
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(success=True)

@bp.route('/api/set_db_connection')
def set_db_connection_call():
    #connection_string = request.headers['connection-string']
    #Database().get_engine(connection_string)
    return 'OK'

app.register_blueprint(bp)
if __name__ == '__main__':
    # app.run(debug=True)

    app.run(port=app.config["CDM_SOUFFLEUR_PORT"])

