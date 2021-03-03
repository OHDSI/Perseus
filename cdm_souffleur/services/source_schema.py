from sqlalchemy.schema import CreateSchema
import ntpath
from pathlib import Path
from pyspark import Row
import pandas as pd
from cdm_souffleur.utils.utils import spark
from cdm_souffleur.utils import GENERATE_CDM_SOURCE_METADATA_PATH, \
    GENERATE_CDM_SOURCE_DATA_PATH, FORMAT_SQL_FOR_SPARK_PARAMS, GENERATE_CDM_XML_PATH
from cdm_souffleur.utils.constants import UPLOAD_SOURCE_SCHEMA_FOLDER, COLUMN_TYPES_MAPPING, TYPES_WITH_MAX_LENGTH, LIST_OF_COLUMN_INFO_FIELDS, N_ROWS_FIELD_NAME
import xml.etree.ElementTree as ElementTree
import os
import csv
import glob
import shutil
from cdm_souffleur.view.Table import Table, Column
from pandasql import sqldf
import xlrd
from cdm_souffleur.utils.utils import Database
from cdm_souffleur.utils.exceptions import InvalidUsage, WrongReportStructure
import json
from werkzeug.utils import secure_filename
from itertools import groupby
from cdm_souffleur.db import pg_db

book = None
ALLOWED_EXTENSIONS = {'xlsx'}

with open('configuration/default.json', 'r') as configuration_file:
    configuration = json.load(configuration_file)
    print(configuration)


def get_source_schema(schemaname):
    """return tables and columns of source schema based on WR report,
     arg actually is path
     """
    print("schema name: " + str(schemaname))
    reset_schema(pg_db)
    if schemaname == configuration['schema']['name']:
        filepath = configuration['schema']['path']
    else:
        filepath = Path(schemaname)

    schema = []
    _open_book(filepath)
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
        create_table_sql += 'CREATE TABLE public.{0} ('.format(table_name)
        for field in fields:
            column_description = field.split(':')
            column_name = column_description[0]
            column_max_length = ""
            if column_description[2] != '0' and column_description[1].lower() in TYPES_WITH_MAX_LENGTH:
                column_max_length = '({0})'.format(column_description[2])
            column_type = '{0}{1}'.format(column_description[1], column_max_length)
            column = Column(column_name, column_type)
            table_.column_list.append(column)
            create_column_sql = '"{0}" {1},'.format(column_name, column_type)
            create_table_sql += create_column_sql
        create_table_sql = create_table_sql.rstrip(',')
        create_table_sql += ' );'
        cursor = pg_db.execute_sql(create_table_sql)
        schema.append(table_)
    pg_db.close()
    return schema


def reset_schema(pg_db, name='public'):
    exists_sql = 'select schema_name FROM information_schema.schemata WHERE schema_name = \'{0}\';'.format(name)
    cursor = pg_db.execute_sql(exists_sql)
    if cursor.rowcount:
        drop_create_schema_sql = 'DROP SCHEMA {0} CASCADE; CREATE SCHEMA {0};'.format(name)
        pg_db.execute_sql(drop_create_schema_sql)


def save_source_schema_in_db(source_tables):
    pg_db.connect()
    reset_schema(pg_db)

    for row in source_tables:
        if row['sql'] == '':
            create_table_sql = '';
            table_name = row['name']
            create_table_sql += 'CREATE TABLE public.{0} ('.format(table_name)
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
    pg_db.close()


def get_view_from_db(view_sql):
    pg_db.connect()

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

    pg_db.close()
    return view_res;

def run_sql_transformation(sql_transformation):
    pg_db.connect()
    for val in sql_transformation:
        pg_db.execute_sql(val).description
    pg_db.close()
    return True

def _open_book(filepath=None):
    # TODO decide whether check below is required (if yes, find all cases when book should be set to None)
    global book
    # if book is None and filepath is not None:
    #     book = xlrd.open_workbook(Path(filepath))
    #     return book
    # else:
    #     return book
    book = xlrd.open_workbook(Path(filepath))
    return book


def get_top_values(table_name, column_name=None):
    """return top 10 values be freq for target table and/or column"""
    try:
        table_overview = pd.read_excel(book, table_name, dtype=str,
                                       na_filter=False,
                                       engine='xlrd')
    except xlrd.biffh.XLRDError as e:
        raise InvalidUsage(e.__str__(), 404)
    if column_name is None:
        result = []
        filtered_column = ((name, values) for name, values in
                           table_overview.iteritems() if
                           'Frequency' not in name)
        for name, values in filtered_column:
            column_values = {'column': name, 'data': values.head(10).tolist()}
            result.append(column_values)
        return result
    else:
        try:
            return table_overview[column_name].head(10).tolist()
        except KeyError as e:
            raise InvalidUsage('Column invalid' + e.__str__(), 404)

def get_column_info(table_name, column_name=None):
    """return top 10 values be freq for target table and/or column"""
    try:
        table_overview = pd.read_excel(book, table_name, dtype=str,
                                       na_filter=False,
                                       engine='xlrd')
        overview = pd.read_excel(book, dtype=str, na_filter=False, engine='xlrd')
        sql = f"select * from overview where `table`=='{table_name}' and `field`=='{column_name}'"
        tables_pd = sqldf(sql)._series
        test = tables_pd.keys()
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

def load_report(filepath):
    """Load report from whiteRabbit to DB, separate table for each sheet"""
    # TODO optimization!!!
    report_tables = []
    _open_book(filepath)
    xls = pd.ExcelFile(book, engine='xlrd')
    head, schema_name = ntpath.split(filepath)
    sheets = xls.sheet_names
    engine = Database().get_engine()
    try:
        engine.execute(CreateSchema(schema_name))
        for sheet in sheets:
            tablename = sheet
            df = pd.read_excel(book, sheet, engine='xlrd')
            df.to_sql(tablename, engine, schema=schema_name, if_exists='fail')
            # while spark are not in use
            # rdd_of_rows = _flatten_pd_df(df)
            # spark_df = spark().createDataFrame(rdd_of_rows)
            # spark_df.createOrReplaceTempView(tablename)
            report_tables.append(tablename)
        return report_tables
    except Exception:
        raise


def _flatten_pd_df(pd_df: pd.DataFrame):
    """Given a Pandas DF that has appropriately named columns, this function
    will iterate the rows and generate Spark Row
    objects.  It's recommended that this method be invoked via Spark's flatMap
    """
    rows = []
    for index, series in pd_df.iterrows():
        # Takes a row of a df, exports it as a dict, and then passes an
        # unpacked-dict into the Row constructor
        row_dict = {str(k): str(v) for k, v in series.to_dict().items()}
        rows.append(Row(**row_dict))
    return rows


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


def prepare_source_data(filepath=Path('D:/mdcr.xlsx')):
    """prepare files for CDM builder - only needed columns"""
    spark_ = spark()
    load_report(filepath)
    for root_dir, dirs, files in os.walk(Path('generate/CDM_xml')):
        for filename in files:
            file_tree = ElementTree.parse(f"{Path(root_dir)}/{filename}")
            query = file_tree.find('Query').text.upper()
            for k, v in FORMAT_SQL_FOR_SPARK_PARAMS.items():
                query = query.replace(k, v)
            filtered_data = spark_.sql(query)
            # TODO move write metadata to separete def
            with open(f"{GENERATE_CDM_SOURCE_METADATA_PATH}/{filename}.txt", mode='x') as metadata_file:
                csv_writer = csv.writer(metadata_file, delimiter=',',
                                        quotechar='"')
                header = filtered_data.columns
                csv_writer.writerow(header)
            filtered_data.collect
            filtered_data.write.csv(
                f"{GENERATE_CDM_SOURCE_DATA_PATH}/{filename}",
                compression='gzip', quote='`', nullValue='\0',
                dateFormat='yyyy-MM-dd')
            # TODO move rename to separate def
            old_filename = glob.glob(
                f"{GENERATE_CDM_SOURCE_DATA_PATH}/{filename}*.gz")
            new_filename = f"{GENERATE_CDM_SOURCE_DATA_PATH}/{filename}.gz"
            os.rename(old_filename[0], new_filename)
            shutil.rmtree(f"{GENERATE_CDM_SOURCE_DATA_PATH}/{filename}")


def get_existing_source_schemas_list(path):
    return os.listdir(str(path))


def set_book_to_none():
    global book
    book = None


def _allowed_file(filename):
    """check allowed extension of file"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_schema_to_server(file):
    """save source schema to server side"""
    if file and _allowed_file(file.filename):
        filename = secure_filename(file.filename)
        try:
            os.mkdir(UPLOAD_SOURCE_SCHEMA_FOLDER)
            print(f"Directory {UPLOAD_SOURCE_SCHEMA_FOLDER} created")
        except FileExistsError:
            print(f"Directory {UPLOAD_SOURCE_SCHEMA_FOLDER} already exist")
        file.save(f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{filename}")
        file.close()
    return


def load_saved_source_schema_from_server(schema_name):
    """load saved source schema by name"""
    if schema_name in get_existing_source_schemas_list(
            UPLOAD_SOURCE_SCHEMA_FOLDER):
        source_schema = get_source_schema(
            f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{schema_name}")
        return source_schema
    else:
        return None

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
