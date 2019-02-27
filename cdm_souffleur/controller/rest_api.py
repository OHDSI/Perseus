from flask import Flask, request
from cdm_souffleur.model.xml_writer import get_xml
from _thread import start_new_thread
from cdm_souffleur.model.detector import find_domain, load_report, \
    load_vocabulary

app = Flask(__name__)


@app.route('/')
def call_in_line():
    language = request.args.get('language')
    framework = request.args['framework']  # this one return error if empty
    return "Hello {} and {}!".format(language, framework)


@app.route('/user/<username>')
def show_user_profile(username):
    # показать профиль данного пользователя
    return 'User %s' % username


# allow both GET and POST requests
@app.route('/form-example', methods=['GET', 'POST'])
def form_example():
    # this block is only entered when the form is submitted
    if request.method == 'POST':
        language = request.form.get('language')
        framework = request.form['framework']

        return '''<h1>The language value is: {}</h1>
                  <h1>The framework value is: {}</h1>'''.format(language,
                                                                framework)

    return '''<form method="POST">
                  Language: <input type="text" name="language"><br>
                  Framework: <input type="text" name="framework"><br>
                  <input type="submit" value="Submit"><br>
              </form>'''


@app.route('/json-example', methods=['POST'])  # GET requests will be blocked
def json_example():
    req_data = request.get_json()

    language = req_data['language']
    framework = req_data['framework']
    # two keys are needed because of the nested object
    python_version = req_data['version_info']['python']
    # an index is needed because of the array
    example = req_data['examples'][0]
    boolean_test = req_data['boolean_test']

    return '''
           The language value is: {}
           The framework value is: {}
           The Python version is: {}
           The item at index 0 in the example list is: {}
           The boolean value is: {}'''.format(language, framework,
                                              python_version, example,
                                              boolean_test)


@app.route('/get_xml', methods=['POST'])
def xml():
    json = request.get_json()
    xml = get_xml(json)
    return '''
    This is answer {}
    '''.format(xml)


@app.route('/find_domain')
def find_domain_call():
    column_name = request.args.get('column_name')
    table_name = request.args.get('table_name')
    start_new_thread(find_domain, (column_name, table_name))
    return 'OK'


@app.route('/load_report')
def load_report_call():
    """
    load report about source schema
    :return:
    """
    path = request.args.get('path')
    start_new_thread(load_report, (path,))
    return 'OK'


@app.route('/load_vocabulary')
def load_vocabulary_call():
    """
    load vocabulary
    :return:
    """
    # TODO rewrite to threading instead _thread?
    path = request.args.get('path')
    start_new_thread(load_vocabulary, (path,))
    return 'OK'


if __name__ == '__main__':
    app.run()
