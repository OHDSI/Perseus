from pathlib import Path
import pandas as pd
from cdm_souffleur.utils import FORMAT_SQL_FOR_SPARK_PARAMS, GENERATE_CDM_XML_PATH
from cdm_souffleur.utils.column_types_mapping import postgres_types_mapping
from cdm_souffleur.utils.constants import UPLOAD_SOURCE_SCHEMA_FOLDER, COLUMN_TYPES_MAPPING, TYPES_WITH_MAX_LENGTH, LIST_OF_COLUMN_INFO_FIELDS, N_ROWS_FIELD_NAME
import xml.etree.ElementTree as ElementTree
import os
from cdm_souffleur.view.Table import Table, Column
from pandasql import sqldf
import xlrd
from cdm_souffleur.utils.exceptions import InvalidUsage
import json
from werkzeug.utils import secure_filename
from itertools import groupby
from cdm_souffleur.db import pg_db
import re

ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

with open('configuration/default.json', 'r') as configuration_file:
    configuration = json.load(configuration_file)
    print(configuration)


def get_source_schema(current_user, schemaname):
    """return tables and columns of source schema based on WR report,
     arg actually is path
     """
    print("schema name: " + str(schemaname))
    reset_schema(pg_db, name=current_user)
    filepath = Path(schemaname)

    schema = []
    book = _open_book(filepath)
    overview = pd.read_excel(book, dtype=str, na_filter=False, engine='xlrd')
    # always take the first sheet of the excel file

    tables_pd = sqldf(
        """select `table`, group_concat(field || ':' || type || ':' || "Max length", ',') as fields
         from overview group by `table`;""")
    tables_pd = tables_pd[tables_pd.Table != '']
    for index, row in tables_pd.iterrows():
        create_table_sql = '';
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
        cursor = pg_db.execute_sql(create_table_sql)
        schema.append(table_)
    return schema


def reset_schema(pg_db, name='public'):
    exists_sql = 'select schema_name FROM information_schema.schemata WHERE schema_name = \'{0}\';'.format(name)
    cursor = pg_db.execute_sql(exists_sql)
    if cursor.rowcount:
        drop_schema_sql = 'DROP SCHEMA {0} CASCADE;'.format(name)
        pg_db.execute_sql(drop_schema_sql)
    create_schema_sql = ' CREATE SCHEMA {0};'.format(name)
    pg_db.execute_sql(create_schema_sql)


def save_source_schema_in_db(current_user, source_tables):
    reset_schema(pg_db, name=current_user)

    for row in source_tables:
        if row['sql'] == '':
            create_table_sql = '';
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
            cursor = pg_db.execute_sql(create_table_sql)


def convert_column_type(type):
    if type.upper() in postgres_types_mapping:
        return postgres_types_mapping[type.upper()]
    else:
        return type.upper()

def get_view_from_db(current_user, view_sql):
    view_sql = addSchemaNames(current_user, view_sql)
    view_cursor = pg_db.execute_sql(view_sql).description
    view_key= lambda a: a.name
    view_groups = groupby(sorted(view_cursor, key=view_key), key=view_key)
    view_res=[]
    for key, group in view_groups:
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

def addSchemaNames(current_user, view_sql):
    user_schema_tables = pg_db.execute_sql(
        'SELECT table_name FROM information_schema.tables WHERE table_schema=\'{0}\''.format(current_user))
    for row in user_schema_tables.fetchall():
        view_sql = re.sub(f"(?i)join {row[0]} ", f'join {current_user}.{row[0]} ', view_sql)
        view_sql = re.sub(f"(?i)from {row[0]} ", f'from {current_user}.{row[0]} ', view_sql)
        view_sql = re.sub(f"(?i)from {row[0]};", f'from {current_user}.{row[0]};', view_sql)
    return view_sql

def run_sql_transformation(current_user, sql_transformation):
    for val in sql_transformation:
        val = addSchemaNames(current_user, val)
        pg_db.execute_sql(val).description
    return True

def _open_book(filepath=None):
    book = xlrd.open_workbook(Path(filepath))
    return book


def get_column_info(current_user, report_name, table_name, column_name=None):
    """return top 10 values be freq for target table and/or column"""
    report_name = secure_filename(report_name)
    path_to_schema = f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user}/{report_name}"
    try:
        table_overview = pd.read_excel(path_to_schema, table_name, dtype=str,
                                       na_filter=False,
                                       engine='xlrd')
        overview = pd.read_excel(path_to_schema, dtype=str, na_filter=False, engine='xlrd')
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
        if N_ROWS_FIELD_NAME in tables_pd:
            for freq in info['frequency']:
                if freq:
                    percentage.append(int(freq) / int(tables_pd[N_ROWS_FIELD_NAME][0]))
            info['percentage'] = percentage
        for field in LIST_OF_COLUMN_INFO_FIELDS:
            if field in tables_pd:
                info[field] = tables_pd[field][0]
        return info
    except KeyError as e:
        raise InvalidUsage('Column invalid' + e.__str__(), 404)


def extract_sql(source_table_name):
    result = {}
    file_to_select = source_table_name + '.xml'
    for root_dir, dirs, files in os.walk(GENERATE_CDM_XML_PATH):
        for filename in files:
            if filename == file_to_select:
                file_tree = ElementTree.parse(f"{Path(root_dir)}/{filename}")
                query = file_tree.find('Query').text.upper()
                for k, v in FORMAT_SQL_FOR_SPARK_PARAMS.items():
                    query = query.replace(k, v)
                    result[filename] = query
    return result


def get_existing_source_schemas_list(path):
    return os.listdir(str(path))



def _allowed_file(filename):
    """check allowed extension of file"""
    if '.' not in filename:
        return f"{filename}.xlsx"
    else:
        if filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
            return filename
        else:
            raise InvalidUsage("Incorrect scan report extension. Only xlsx or xls are allowed", 400)


def load_schema_to_server(file, current_user):
    """save source schema to server side"""
    checked_filename = _allowed_file(file.filename)
    if file and checked_filename:
        filename = secure_filename(checked_filename)
        try:
            os.makedirs(f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user}")
            print(f"Directory {UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user} created")
        except FileExistsError:
            print(f"Directory {UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user} already exist")
        file.save(f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user}/{filename}")
        file.close()
    return


def load_saved_source_schema_from_server(current_user, schema_name):
    """load saved source schema by name"""
    schema_name = secure_filename(schema_name)
    if schema_name in get_existing_source_schemas_list(
            f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user}"):
        source_schema = get_source_schema(current_user,
            f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user}/{schema_name}")
        return source_schema
    else:
        raise InvalidUsage('Schema was not loaded', 404)

# def remove_existing_mappings():
#     for root, dirs, files in os.walk(GENERATE_CDM_XML_PATH):
#         for f in files:
#             os.unlink(os.path.join(root, f))


if __name__ == '__main__':
    # for i in get_source_schema():
    #     print(i.to_json())
    # prepare_source_data()
    # for table in get_source_schema('D:/mdcr.xlsx'):
    #     print(table.to_json())
    # for table in get_source_schema('D:/mdcr.xlsx'):
    #     print(table.to_json())
    # get_top_values('test', 'test')
    # load_report()
    pass
