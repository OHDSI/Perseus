import re

DEFAULT_SOLR_QUERY = '*:*'

FORBIDDEN_SYMBOLS = ["'", '"']
STRICT_DOUBLE_QUOTE_SPEC_SYMBOLS = ['(', ')', '^', '[', ']', '{', '}']


def search_term_to_query(search_term: str) -> str:
    parsed_search_query = search_term.strip()
    if not parsed_search_query:
        return DEFAULT_SOLR_QUERY
    if len(parsed_search_query) == 1 and not parsed_search_query.isalnum():
        if parsed_search_query in FORBIDDEN_SYMBOLS:
            return DEFAULT_SOLR_QUERY
        elif parsed_search_query in STRICT_DOUBLE_QUOTE_SPEC_SYMBOLS:
            return f'term:"{parsed_search_query}"'
        else:
            return f"term:'{parsed_search_query}'"
    elif re.search(r"\s", parsed_search_query):
        return f"term:({parsed_search_query})"
    else:
        return f"term:{parsed_search_query}"
