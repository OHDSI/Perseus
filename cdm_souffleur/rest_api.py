from cdm_souffleur.utils.constants import GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT
from flask import Flask, request, jsonify, send_from_directory, flash, redirect, url_for
from flask_cors import CORS
from cdm_souffleur.model.xml_writer import get_xml, zip_xml
from _thread import start_new_thread
from cdm_souffleur.model.detector import find_domain, load_vocabulary, \
    return_lookup_list
from cdm_souffleur.model.source_schema import load_report, get_source_schema, \
    get_top_values, get_existing_source_schemas_list
from cdm_souffleur.model.cdm_schema import get_exist_version, get_schema
from cdm_souffleur.utils.exceptions import InvalidUsage
import traceback
from werkzeug.utils import secure_filename
from pathlib import Path

UPLOAD_FOLDER = Path('model/generate/income_schema')
ALLOWED_EXTENSIONS = {'xlsx'}

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'mdcr'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/put', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(str(Path(app.config['UPLOAD_FOLDER']) / filename))
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


@app.route('/get_cdm_versions')
def get_cdm_versions_call():
    """return available CDM versions schema list"""
    return jsonify(get_exist_version())


@app.route('/get_cdm_schema')
def get_cdm_schema_call():
    """return CDM schema for target version"""
    cdm_version = request.args.get('cdm_version')
    cdm_schema = get_schema(cdm_version)
    return jsonify([s.to_json() for s in cdm_schema])


@app.route('/get_source_schema')
def get_source_schema_call():
    """return with source schema based on White Rabbit report"""
    path = request.args.get('path')
    source_schema = get_source_schema(path)
    return jsonify([s.to_json() for s in source_schema])


@app.route('/get_top_values')
def get_top_values_call():
    """return top 10 values by freq for table and row based on WR report"""
    table_name = request.args.get('table_name')
    column_name = request.args.get('column_name')
    top_values = get_top_values(table_name, column_name)
    return jsonify(top_values)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """handle error of wrong usage on functions"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.route('/get_lookup_list')
def get_lookups_call():
    """return lookups list of ATHENA vocabulary"""
    path = request.args.get('path')
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
    zip_xml()
    return send_from_directory(GENERATE_CDM_XML_ARCHIVE_PATH,
                               filename='.'.join((
                                            GENERATE_CDM_XML_ARCHIVE_FILENAME,
                                            GENERATE_CDM_XML_ARCHIVE_FORMAT)),
                               as_attachment=True)


@app.route('/find_domain')
def find_domain_call():
    # TODO what return how to run when init spark?
    column_name = request.args.get('column_name')
    table_name = request.args.get('table_name')
    start_new_thread(find_domain, (column_name, table_name))
    return 'OK'


@app.route('/load_report')
def load_report_call():
    """load report about source schema"""
    path = request.args.get('path')
    start_new_thread(load_report, (path,))
    return 'OK'


@app.route('/load_vocabulary')
def load_vocabulary_call():
    """load vocabulary"""
    # TODO rewrite to threading instead _thread?
    path = request.args.get('path')
    start_new_thread(load_vocabulary, (path,))
    return 'OK'


if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host='0:0:0:0', port=5000)