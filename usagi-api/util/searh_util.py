import re

DEFAULT_SOLR_QUERY = '*:*'


def search_term_to_query(search_term: str) -> str:
    parsed_search_query = '+'.join(re.split('[^a-zA-Z0-9]', search_term))
    return f"term:{parsed_search_query}" if parsed_search_query else DEFAULT_SOLR_QUERY
