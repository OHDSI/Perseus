import re
from typing import List
from utils import InvalidUsage
from utils.string_util import hasCapitalLetter


def is_sql_safety(sql: str, schemas: List[str]):
    if not start_with_select_or_with(sql):
        raise InvalidUsage('SQL must start with SELECT')
    if contains_schema_names(sql, schemas):
        raise InvalidUsage('SQL must not contains schema name')


def start_with_select_or_with(sql: str) -> bool:
    return re.match('^(?i)(select|with).*', sql) is not None


def contains_schema_names(sql: str, schemas: List[str]) -> bool:
    for schema in schemas:
        if f'{schema}.' in sql or f'"{schema}".' in sql:
            return True
    return False


def add_schema_names(username: str, view_sql: str, user_schema_tables: List[str]) -> str:
    for table_name in user_schema_tables:
        if hasCapitalLetter(table_name):
            view_sql = re.sub(f'(?i)join( |\n)+"{table_name}"', f'join {username}."{table_name}"', view_sql)
            view_sql = re.sub(f'(?i)from( |\n)+"{table_name}"', f'from {username}."{table_name}"', view_sql)
        else:
            view_sql = re.sub(f"(?i)join( |\n)+{table_name}", f'join {username}.{table_name}', view_sql)
            view_sql = re.sub(f"(?i)from( |\n)+{table_name}", f'from {username}.{table_name}', view_sql)
    return view_sql