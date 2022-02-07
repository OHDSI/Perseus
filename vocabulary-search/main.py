from flask import *
import os
from flask_cors import CORS
from constants import VOCABULARY_FILTERS, ATHENA_CORE_NAME
from search_service import search_athena

# env = os.getenv('ATHENA_ENV').capitalize()
env = 'Local'
app = Flask(__name__)
app.config.from_object(f'config.{env}Config')
CORS(app)

IS_PROD = app.config['IS_PROD']
IS_DEV = not IS_PROD
SOLR_CONNECTION_STRING = f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{ATHENA_CORE_NAME}"
APP_PREFIX = app.config["APP_PREFIX"]

vocabulary_search = Blueprint('vocabulary_search', __name__, url_prefix=APP_PREFIX)


@vocabulary_search.route('/api', methods=['GET'])
def search_concepts():
    """save source schema to server side"""
    query = request.args.get('query')
    page_size = request.args.get('pageSize')
    page = request.args.get('page')
    sort = request.args.get('sort')
    order = request.args.get('order')
    filters = {}
    for key in VOCABULARY_FILTERS:
        filters[key] = request.args.get(VOCABULARY_FILTERS[key])
    update_filters = request.args.get('updateFilters')
    search_result = search_athena(SOLR_CONNECTION_STRING, page_size, page, query, sort, order, filters, update_filters)
    return jsonify(search_result)


app.register_blueprint(vocabulary_search)
if __name__ == '__main__':
    app.run(debug=IS_DEV, port=app.config['PORT'])