import sys
import numpy
from peewee import PostgresqlDatabase


def delete_all_tables_in_scheme(schema: str,
                                host='localhost',
                                port=5432,
                                db_name='source',
                                user='source',
                                password='password'):
    source_db = PostgresqlDatabase(db_name, user=user, password=password, host=host, port=port)
    select_all_tables = f"SELECT tablename FROM pg_tables WHERE schemaname = '{schema}';"
    cursor = source_db.execute_sql(select_all_tables)
    count = cursor.rowcount
    current = 0
    print(f"Extracted {count} tables")

    for (table,) in cursor:
        drop_table = f'DROP TABLE "{schema}"."{table}" CASCADE;'
        source_db.execute_sql(drop_table)
        current = current + 1
        percent = numpy.around(numpy.double(current) / count * 100, 2).astype(int).item()
        sys.stdout.write('\r')
        sys.stdout.write("[%-100s] %d%%" % ('=' * percent, percent))
        sys.stdout.flush()
    print("\nAl tables successfully deleted")


delete_all_tables_in_scheme(schema='perseus',
                            host='localhost',
                            port=5432,
                            db_name='source',
                            user='source',
                            password='password')
