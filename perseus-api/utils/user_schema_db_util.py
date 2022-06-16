from db import user_schema_db


def open_conn():
    if user_schema_db.is_closed():
        user_schema_db.connect()


def close_conn():
    if not user_schema_db.is_closed():
        user_schema_db.close()