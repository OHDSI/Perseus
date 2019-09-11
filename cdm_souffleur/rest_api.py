from cdm_souffleur.utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT, \
    UPLOAD_SOURCE_SCHEMA_FOLDER
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from cdm_souffleur.model.xml_writer import get_xml, zip_xml, \
    delete_generated_xml
from _thread import start_new_thread
from cdm_souffleur.model.detector import find_domain, load_vocabulary, \
    return_lookup_list
from cdm_souffleur.model.source_schema import load_report, get_source_schema, \
    get_existing_source_schemas_list, get_top_values
from cdm_souffleur.model.cdm_schema import get_exist_version, get_schema
from cdm_souffleur.utils.exceptions import InvalidUsage
import traceback
from werkzeug.utils import secure_filename
from werkzeug.exceptions import BadRequestKeyError
import os

UPLOAD_FOLDER = UPLOAD_SOURCE_SCHEMA_FOLDER
ALLOWED_EXTENSIONS = {'xlsx'}

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'mdcr'


def _allowed_file(filename):
    """check allowed extension of file"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/load_schema', methods=['GET', 'POST'])
def load_schema():
    """save source schema to server side"""
    if request.method == 'POST':
        file = request.files['file']
        if file and _allowed_file(file.filename):
            filename = secure_filename(file.filename)
            try:
                os.mkdir(UPLOAD_FOLDER)
                print("Directory ", UPLOAD_FOLDER, " Created ")
            except FileExistsError:
                print("Directory ", UPLOAD_FOLDER, " Already exist ")
            file.save(str(app.config['UPLOAD_FOLDER'] / filename))
            file.close()
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form action="" method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''


@app.route('/get_existing_source_schemas_list', methods=['GET'])
def get_existing_source_schemas_list_call():
    return jsonify(get_existing_source_schemas_list())


@app.route('/load_saved_source_schema', methods=['GET'])
def load_saved_source_schema_call():
    schema_name = request.args['schema_name']
    if schema_name in get_existing_source_schemas_list():
        source_schema = get_source_schema(
            app.config['UPLOAD_FOLDER'] / schema_name)
        return jsonify([s.to_json() for s in source_schema])
    else:
        raise InvalidUsage('Schema was not loaded', 404)


@app.route('/delete_saved_source_schema', methods=['GET'])
def delete_saved_source_schema_call():
    schema_name = request.args['schema_name']
    if schema_name in get_existing_source_schemas_list():
        os.remove(app.config['UPLOAD_FOLDER'] / schema_name)
        return 'OK'
    else:
        raise InvalidUsage('Schema was not loaded', 404)


@app.route('/get_cdm_versions')
def get_cdm_versions_call():
    """return available CDM versions schema list"""
    return jsonify(get_exist_version())


@app.route('/get_cdm_schema')
def get_cdm_schema_call():
    """return CDM schema for target version"""
    cdm_version = request.args['cdm_version']
    cdm_schema = get_schema(cdm_version)
    return jsonify([s.to_json() for s in cdm_schema])


@app.route('/get_source_schema')
def get_source_schema_call():
    """return with source schema based on White Rabbit report"""
    path = request.args['path']
    source_schema = get_source_schema(path)
    return jsonify([s.to_json() for s in source_schema])


@app.route('/get_top_values')
def get_top_values_call():
    """return top 10 values by freq for table and row(optionally)
    based on WR report
    """
    table_name = request.args['table_name']
    column_name = request.args.get('column_name')
    return jsonify(get_top_values(table_name, column_name))


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """handle error of wrong usage on functions"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(BadRequestKeyError)
def handle_invalid_req_key(error):
    """handle error of missed\wrong parameter"""
    response = jsonify({'message': error.__str__()})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.route('/get_lookup_list')
def get_lookups_call():
    """return lookups list of ATHENA vocabulary"""
    path = request.args['path']
    lookups = return_lookup_list(path)
    return jsonify(lookups)


@app.route('/get_xml', methods=['POST'])
def xml():
    """return XML for CDM builder in map {source_table: XML, } and
    create file on back-end
    """
    json = request.get_json()
    xml_ = get_xml(json)
    return jsonify(xml_)


@app.route('/get_zip_xml')
def zip_xml_call():
    """return attached ZIP of XML's from back-end folder
    TODO  - now the folder is not cleared
    """
    try:
        zip_xml()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return send_from_directory(GENERATE_CDM_XML_ARCHIVE_PATH,
                               filename='.'.join((
                                            GENERATE_CDM_XML_ARCHIVE_FILENAME,
                                            GENERATE_CDM_XML_ARCHIVE_FORMAT)),
                               as_attachment=True)


@app.route('/clear_xml_dir')
def clear_xml_dir_call():
    try:
        delete_generated_xml()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return 'OK'


@app.route('/find_domain')
def find_domain_call():
    """load report and vocabulary before, return matched codes"""
    column_name = request.args['column_name']
    table_name = request.args['table_name']
    try:
        found_codes = find_domain(column_name, table_name).toPandas().to_json(
            orient='records')
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(found_codes)


@app.route('/load_report')
def load_report_call():
    """load report about source schema"""
    path = request.args['path']
    start_new_thread(load_report, (path,))
    return 'OK'


@app.route('/load_vocabulary')
def load_vocabulary_call():
    """load vocabulary"""
    # TODO rewrite to threading instead _thread?
    path = request.args['path']
    start_new_thread(load_vocabulary, (path,))
    return 'OK'


if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host='0:0:0:0', port=5000)