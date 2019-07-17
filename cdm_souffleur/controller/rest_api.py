from flask import Flask, request, jsonify
from flask_cors import CORS
from cdm_souffleur.model.xml_writer import get_xml
from _thread import start_new_thread
from cdm_souffleur.model.detector import find_domain, load_vocabulary
from cdm_souffleur.model.source_schema import load_report, get_source_schema, get_top_values
from cdm_souffleur.model.cdm_schema import get_exist_version, get_schema

app = Flask(__name__)
CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0')

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
    table_name = request.args.get('table_name')
    column_name = request.args.get('column_name')
    top_values = get_top_values(table_name, column_name)
    return jsonify(top_values)


@app.route('/get_xml', methods=['POST'])
def xml():
    json = request.get_json()
    xml_ = get_xml(json)
    return '''
    This is answer {}
    '''.format(xml_)


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
