from flask import request, jsonify, Blueprint

from app import app
from config import APP_PREFIX, VERSION
from service.search_service import search_athena
from constants import VOCABULARY_FILTERS

athena = Blueprint('athena', __name__, url_prefix=APP_PREFIX)


@athena.route('/api/info', methods=['GET'])
def app_version():
    app.logger.info("REST request to GET app info")
    return jsonify({'name': 'Athena', 'version': VERSION})


@athena.route('/api', methods=['GET'])
def search_concepts():
    """save source schema to server side"""
    app.logger.info("REST request to GET vocabulary")
    query = request.args.get('query')
    page_size = request.args.get('pageSize')
    page = request.args.get('page')
    sort = request.args.get('sort')
    order = request.args.get('order')
    filters = {}
    for key in VOCABULARY_FILTERS:
        filters[key] = request.args.get(VOCABULARY_FILTERS[key])
    update_filters = request.args.get('updateFilters')
    search_result = search_athena(page_size, page, query, sort, order, filters, update_filters)
    return jsonify(search_result)