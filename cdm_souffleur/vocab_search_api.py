from flask import request, jsonify, Blueprint

from cdm_souffleur.model.user import token_required
from cdm_souffleur.services.vocabulary_service import search_vocabulary_concepts
from cdm_souffleur.utils.constants import VOCABULARY_FILTERS

vocab_search_api = Blueprint('vocab_search_api', __name__)

@vocab_search_api.route('/api/search_concepts', methods=['GET'])
@token_required
def search_concepts(current_user):
    """save source schema to server side"""
    query = request.args.get('query')
    pageSize = request.args.get('pageSize')
    page = request.args.get('page')
    sort = request.args.get('sort')
    order = request.args.get('order')
    filters = {}
    for key in VOCABULARY_FILTERS:
        filters[key] = request.args.get(VOCABULARY_FILTERS[key])
    update_filters = request.args.get('updateFilters')
    search_result = search_vocabulary_concepts(pageSize, page, query, sort, order, filters, update_filters)
    return jsonify(search_result)