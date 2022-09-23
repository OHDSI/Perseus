import re

DEFAULT_SOLR_QUERY = '*:*'

FORBIDDEN_SYMBOLS = ["'", '"']
STRICT_DOUBLE_QUOTE_SPEC_SYMBOLS = ['(', ')', '^', '[', ']', '{', '}']


def parse_search_query(query: str or None) -> str:
    if not query:
        return DEFAULT_SOLR_QUERY
    parsed_query = query.strip()
    if not parsed_query:
        return DEFAULT_SOLR_QUERY
    if len(parsed_query) == 1 and not parsed_query.isalnum():
        if parsed_query in FORBIDDEN_SYMBOLS:
            return DEFAULT_SOLR_QUERY
        elif parsed_query in STRICT_DOUBLE_QUOTE_SPEC_SYMBOLS:
            parsed_query = f'"{parsed_query}"'
        else:
            parsed_query = f"'{parsed_query}'"
    elif re.search(r"\s", parsed_query):
        parsed_query = f'({parsed_query})'

    return f"concept_name:{parsed_query} OR concept_code:{parsed_query} OR concept_id:{parsed_query}"