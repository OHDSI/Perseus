from typing import List

from db import user_schema_db


def select_user_tables(username: str) -> List[str]:
    query = 'SELECT table_name FROM information_schema.tables WHERE table_schema=\'{0}\'' \
        .format(username)
    query_result = user_schema_db.execute_sql(query).fetchall()
    tables = []
    for item in query_result:
        tables.append(item[0])
    return tables


def select_all_schemas_from_source_table() -> List[str]:
    query = 'SELECT schema_name FROM information_schema.schemata'
    query_result = user_schema_db.execute_sql(query).fetchall()
    schemas = []
    for item in query_result:
        schemas.append(item[0])
    return schemas
