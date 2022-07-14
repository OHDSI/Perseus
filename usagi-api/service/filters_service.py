import pysolr

from util.constants import SOLR_CONN_STRING, SOLR_FILTERS


def get_filters():
    solr = pysolr.Solr(SOLR_CONN_STRING, always_commit=True)
    facets = {}
    for key in SOLR_FILTERS:
        params = {
            'facet': 'on',
            'facet.field': key,
            'rows': '0',
        }
        results = solr.search("*:*", **params)
        facets_string_values = [x for x in results.facets['facet_fields'][key] if not isinstance(x, int)]
        facets[SOLR_FILTERS[key]] = sorted(facets_string_values)
    return facets
