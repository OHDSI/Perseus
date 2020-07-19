from sqlalchemy.schema import CreateSchema
import ntpath
from pathlib import Path
from pyspark import Row
import pandas as pd
from cdm_souffleur.utils.utils import spark
from cdm_souffleur.utils import GENERATE_CDM_SOURCE_METADATA_PATH, \
    GENERATE_CDM_SOURCE_DATA_PATH, FORMAT_SQL_FOR_SPARK_PARAMS, GENERATE_CDM_XML_PATH
from cdm_souffleur.utils.constants import UPLOAD_SOURCE_SCHEMA_FOLDER
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

    if schemaname == configuration['schema']['name']:
        filepath = configuration['schema']['path']
    else:
        filepath = Path(schemaname)

    schema = []
    _open_book(filepath)
    try:
        SHEET_NAME = 'Overview'
        HEADER = ['Table', 'Field', 'Type', 'Max length', 'N rows', 'N rows checked', 'Fraction empty']

        # always take the sheet "Overview" of the excel file
        overview = pd.read_excel(book, dtype=str, sheet_name=SHEET_NAME, na_filter=False, engine='xlrd')

        header = overview.columns.ravel().tolist()
        if header != HEADER:
            raise WrongReportStructure('Report file does not contain "Overview" sheet')
    except xlrd.biffh.XLRDError as err:
        print(err)
        raise WrongReportStructure('Incorrect header of "Overview" sheet')

    tables_pd = sqldf(
        """select `table`, group_concat(field || ':' || type, ',') as fields
         from overview group by `table`;""")
    tables_pd = tables_pd[tables_pd.Table != '']
    for index, row in tables_pd.iterrows():
        table_name = row['Table']
        fields = row['fields'].split(',')
        table_ = Table(table_name)
        for field in fields:
            column_description = field.split(':')
            column_name = column_description[0]
            column_type = column_description[1]
            column = Column(column_name, column_type)
            table_.column_list.append(column)
        schema.append(table_)
    return schema


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
