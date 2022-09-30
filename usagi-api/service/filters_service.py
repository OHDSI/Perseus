import pysolr

from util.basic_auth_util import create_auth
from util.constants import SOLR_CONN_STRING, SOLR_FILTERS
from util.searh_util import DEFAULT_SOLR_QUERY


def get_filters():
    solr = pysolr.Solr(SOLR_CONN_STRING, always_commit=True, auth=create_auth())
    facets = {}
    for key in SOLR_FILTERS:
        params = {
            'facet': 'on',
            'facet.field': key,
            'rows': '0',
        }
        results = solr.search(DEFAULT_SOLR_QUERY, **params)
        facets_string_values = [x for x in results.facets['facet_fields'][key] if not isinstance(x, int)]
        facets[SOLR_FILTERS[key]] = sorted(facets_string_values)
    return facets
