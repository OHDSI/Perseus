from pathlib import Path
from pyspark import Row
import pandas as pd
from cdm_souffleur.utils.utils import spark
from cdm_souffleur.utils import GENERATE_CDM_SOURCE_METADATA_PATH, \
    GENERATE_CDM_SOURCE_DATA_PATH, FORMAT_SQL_FOR_SPARK_PARAMS, \
    UPLOAD_SOURCE_SCHEMA_FOLDER
import xml.etree.ElementTree as ElementTree
import os
import csv
import glob
import shutil
from cdm_souffleur.view.Table import Table, Column
from pandasql import sqldf, PandaSQLException
import xlrd
from cdm_souffleur.utils import time_it
from cdm_souffleur.utils.exceptions import InvalidUsage

import json

book = None

with open('configuration/default.json', 'r') as configuration_file:
    configuration = json.load(configuration_file)
    print(configuration)


@time_it
def get_source_schema(schemaname):
    """return tables and columns of source schema based on WR report"""
    print("schema name: " + str(schemaname))

    if schemaname == configuration['schema']['name']:
        filepath = configuration['schema']['path']
    else:
        filepath = Path(schemaname)

    schema = []
    _open_book(filepath)
    overview = pd.read_excel(book, 'Overview', dtype=str, na_filter=False,
                             engine='xlrd')
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


@time_it
def _open_book(filepath=None):
    global book
    if book is None and filepath is not None:
        book = xlrd.open_workbook(Path(filepath))
        return book
    else:
        return book


def get_top_values(table_name, column_name=None):
    """return top 10 values be freq for target table and\or column"""
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


def load_report(filepath=Path('D:/mdcr.xlsx')):
    """Load report from whiteRabbit to Dataframe, separate table for each sheet
    to acts like with a real tables
    """
    # TODO optimization!!!
    report_tables = []
    filepath_path = Path(filepath)
    xls = pd.ExcelFile(filepath_path)
    sheets = xls.sheet_names
    for sheet in sheets:
        tablename = sheet
        df = pd.read_excel(filepath_path, sheet)
        rdd_of_rows = _flatten_pd_df(df)
        spark_df = spark().createDataFrame(rdd_of_rows)
        spark_df.createOrReplaceTempView(tablename)
        report_tables.append(tablename)
    return report_tables


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


def prepare_source_data(filepath=Path('D:/mdcr.xlsx')):
    """prepare files for CDM builder - only needed columns"""
    spark_ = spark()
    load_report(filepath)
    for root_dir, dirs, files in os.walk(Path('generate/CDM_xml')):
        for filename in files:
            file_tree = ElementTree.parse(Path(root_dir) / filename)
            query = file_tree.find('Query').text.upper()
            for k, v in FORMAT_SQL_FOR_SPARK_PARAMS.items():
                query = query.replace(k, v)
            filtered_data = spark_.sql(query)
            # TODO move write metadata to separete def
            with open(GENERATE_CDM_SOURCE_METADATA_PATH / (
                    filename + '.txt'), mode='x') as metadata_file:
                csv_writer = csv.writer(metadata_file, delimiter=',',
                                        quotechar='"')
                header = filtered_data.columns
                csv_writer.writerow(header)
            filtered_data.collect
            filtered_data.write.csv(
                str(GENERATE_CDM_SOURCE_DATA_PATH / filename),
                compression='gzip', quote='`', nullValue='\0',
                dateFormat='yyyy-MM-dd')
            # TODO move rename to separate def
            old_filename = glob.glob(
                str(GENERATE_CDM_SOURCE_DATA_PATH / filename / '*.gz'))
            new_filename = str(
                GENERATE_CDM_SOURCE_DATA_PATH / (filename + '.gz'))
            os.rename(old_filename[0], new_filename)
            shutil.rmtree(str(GENERATE_CDM_SOURCE_DATA_PATH / filename))


def get_existing_source_schemas_list():
    return os.listdir(str(UPLOAD_SOURCE_SCHEMA_FOLDER))


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
