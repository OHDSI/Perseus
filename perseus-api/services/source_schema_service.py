import re
import xlrd
import pandas as pd

from itertools import groupby
from pathlib import Path
from pandasql import sqldf
from werkzeug.utils import secure_filename

from app import app
from db import user_schema_db
from model.etl_mapping import EtlMapping
from services import etl_mapping_service, cache_service
from services.scan_reports_service import get_scan_report_path
from utils.column_types_mapping import postgres_types_mapping, postgres_types
from utils.constants import UPLOAD_SCAN_REPORT_FOLDER, COLUMN_TYPES_MAPPING,\
                            TYPES_WITH_MAX_LENGTH, LIST_OF_COLUMN_INFO_FIELDS,\
                            N_ROWS_FIELD_NAME, N_ROWS_CHECKED_FIELD_NAME
from utils.directory_util import is_directory_contains_file
from utils.exceptions import InvalidUsage
from view.Table import Table, Column


ALLOWED_EXTENSIONS = {'xlsx', 'xls'}


def create_source_schema_by_scan_report(current_user: str, etl_mapping: EtlMapping):
    app.logger.info("Creating source schema by WR scan report...")
    scan_report_name = secure_filename(etl_mapping.scan_report_name)
    user_schema_folder = f"{UPLOAD_SCAN_REPORT_FOLDER}/{current_user}"
    if is_directory_contains_file(user_schema_folder, scan_report_name):
        print("schema name: " + str(scan_report_name))
        scan_report_path = f"{UPLOAD_SCAN_REPORT_FOLDER}/{current_user}/{scan_report_name}"
        source_schema = _create_source_schema_by_scan_report(current_user, etl_mapping.id, scan_report_path)
        return source_schema
    else:
        raise InvalidUsage('Schema was not loaded', 500)


def _create_source_schema_by_scan_report(current_user, etl_mapping_id: int, scan_report_path):
    """Create source schema by White Rabbit scan report and return it. Cast to postgres types"""
    reset_schema(name=current_user)

    try:
        book = xlrd.open_workbook(Path(scan_report_path), on_demand=True)
        cache_service.set_uploaded_scan_report_info(current_user, etl_mapping_id, scan_report_path, book)
    except Exception as e:
        raise InvalidUsage(f"Could not open scan report file: {e.__str__()}", 500)

    # always take the first sheet of the excel file
    overview = pd.read_excel(book, dtype=str, na_filter=False, engine='xlrd')

    schema = []
    tables_pd = sqldf(
        """select `table`, group_concat(field || ':' || type || ':' || "Max length", ',') as fields
         from overview group by `table`;""")
    tables_pd = tables_pd[tables_pd.Table != '']
    for _, row in tables_pd.iterrows():
        create_table_sql = ''
        table_name = row['Table']
        fields = row['fields'].split(',')
        table_ = Table(table_name)
        create_table_sql += 'CREATE TABLE {0}."{1}" ('.format(current_user, table_name)
        for field in fields:
            column_description = field.split(':')
            column_name = column_description[0]
            column_type = convert_column_type(column_description[1])
            if column_description[2] != '0' and column_description[1].lower() in TYPES_WITH_MAX_LENGTH:
                if column_type == 'TIMESTAMP(P) WITH TIME ZONE':
                    column_type = column_type.replace('(P)', f'({column_description[2]})')
                elif column_type == 'TEXT':
                    column_type = '{0}'.format(column_description[1])
                else:
                    column_type = '{0}({1})'.format(column_description[1], column_description[2])
            column = Column(column_name, column_type)
            table_.column_list.append(column)
            create_column_sql = '"{0}" {1},'.format(column_name, column_type)
            create_table_sql += create_column_sql
        create_table_sql = create_table_sql.rstrip(',')
        create_table_sql += ' );'
        user_schema_db.execute_sql(create_table_sql)
        schema.append(table_)
    return schema


def create_source_schema_by_tables(current_user, source_tables):
    """Create source schema by source tables from ETL mapping. Without casting to postgres types"""
    reset_schema(name=current_user)

    for row in source_tables:
        if row['sql'] == '':
            create_table_sql = ''
            table_name = row['name']
            create_table_sql += 'CREATE TABLE {0}.{1} ('.format(current_user, table_name)
            for field in row['rows']:
                if len(field['grouppedFields']):
                    for item in field['grouppedFields']:
                        create_column_sql = '"{0}" {1},'.format(item['name'], item['type'])
                        create_table_sql += create_column_sql
                else:
                    create_column_sql = '"{0}" {1},'.format(field['name'], field['type'])
                    create_table_sql += create_column_sql
            create_table_sql = create_table_sql.rstrip(',')
            create_table_sql += ' );'
            user_schema_db.execute_sql(create_table_sql)


def reset_schema(name='public'):
    exists_sql = 'select schema_name FROM information_schema.schemata WHERE schema_name = \'{0}\';'.format(name)
    cursor = user_schema_db.execute_sql(exists_sql)
    if cursor.rowcount:
        drop_schema_sql = 'DROP SCHEMA {0} CASCADE;'.format(name)
        user_schema_db.execute_sql(drop_schema_sql)
    create_schema_sql = ' CREATE SCHEMA {0};'.format(name)
    user_schema_db.execute_sql(create_schema_sql)


def convert_column_type(culumn_type):
    if culumn_type.upper() in postgres_types_mapping:
        return postgres_types_mapping[culumn_type.upper()]
    else:
        return culumn_type.upper()


def remove_parentheses(field_type):
    return re.sub(r'\([^)]*\)', '', field_type)


def get_field_type(field_type):
    converted_type = remove_parentheses(convert_column_type(field_type.upper())).lower()
    for key in postgres_types:
        if converted_type in postgres_types[key]:
            return key
    return 'unknown type'


def get_view_from_db(current_user, view_sql):
    view_sql = add_schema_names(current_user, view_sql)
    view_cursor = user_schema_db.execute_sql(view_sql).description
    view_key= lambda a: a.name
    view_groups = groupby(sorted(view_cursor, key=view_key), key=view_key)
    view_res=[]
    for _, group in view_groups:
        for index, item in enumerate(list(group)):
            res_item={}
            res_item['type'] = COLUMN_TYPES_MAPPING[item.type_code]
            if res_item['type'] == 'varchar' and item.internal_size > 0:
                res_item['type'] = '{0}({1})'.format(res_item['type'], item.internal_size)
            if index>0:
                res_item['name'] = '{0}_{1}'.format(item.name, index)
            else:
                res_item['name'] = item.name
            view_res.append(res_item)

    return view_res


def add_schema_names(current_user, view_sql):
    user_schema_tables = user_schema_db.execute_sql(
        'SELECT table_name FROM information_schema.tables WHERE table_schema=\'{0}\''.format(current_user))
    for row in user_schema_tables.fetchall():
        view_sql = re.sub(f"(?i)join {row[0]} ", f'join {current_user}.{row[0]} ', view_sql)
        view_sql = re.sub(f"(?i)from {row[0]} ", f'from {current_user}.{row[0]} ', view_sql)
        view_sql = re.sub(f"(?i)from {row[0]};", f'from {current_user}.{row[0]};', view_sql)
    return view_sql


def run_sql_transformation(current_user, sql_transformation):
    for val in sql_transformation:
        val = add_schema_names(current_user, val)
        user_schema_db.execute_sql(val).description
    return True


def _open_book(current_user, etl_mapping: EtlMapping):
    scan_report_path = get_scan_report_path(etl_mapping)
    book = xlrd.open_workbook(Path(scan_report_path), on_demand=True)
    cache_service.set_uploaded_scan_report_info(current_user, etl_mapping.id, scan_report_path, book)

    return book


def _get_or_open_book(current_user, etl_mapping: EtlMapping):
    opened_report_data = cache_service.get_scan_report_info(current_user)
    if opened_report_data is None \
            or opened_report_data.book is None \
            or opened_report_data.etl_mapping_id != etl_mapping.id:
        return _open_book(current_user, etl_mapping)
    else:
        return opened_report_data.book


def get_column_info(current_user, etl_mapping_id, table_name, column_name=None):
    """return top 10 values be freq for target table and/or column"""
    current_etl_mapping: EtlMapping = etl_mapping_service.find_by_id(etl_mapping_id, current_user)
    try:
        book = _get_or_open_book(current_user, current_etl_mapping)
        table_overview = pd.read_excel(book, table_name, dtype=str,
                                       na_filter=False,
                                       engine='xlrd')
        overview = pd.read_excel(book, dtype=str, na_filter=False, engine='xlrd')
        sql = f"select * from overview where `table`=='{table_name}' and `field`=='{column_name}'"
        tables_pd = sqldf(sql)._series
    except xlrd.biffh.XLRDError as e:
        raise InvalidUsage(e.__str__(), 404)
    try:
        info = {}
        info['top_10'] = table_overview[column_name].head(10).tolist()
        column_index = table_overview.columns.get_loc(column_name)
        info['frequency'] = table_overview.iloc[:, column_index + 1].head(10).tolist()
        percentage = []
        n_rows = N_ROWS_CHECKED_FIELD_NAME if N_ROWS_CHECKED_FIELD_NAME in tables_pd else \
            N_ROWS_FIELD_NAME if N_ROWS_FIELD_NAME in tables_pd else ''
        if n_rows:
            for freq in info['frequency']:
                if freq:
                    percentage.append('{0:.10f}'.format(int(freq) / int(tables_pd[n_rows][0])))
            info['percentage'] = percentage
        for field in LIST_OF_COLUMN_INFO_FIELDS:
            if field in tables_pd:
                info[field] = tables_pd[field][0]
        return info
    except KeyError as e:
        raise InvalidUsage('Column invalid' + e.__str__(), 404)
