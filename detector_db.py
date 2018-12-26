from pyspark.sql import SparkSession
from pyspark import Row
from pyspark import SparkContext
import time
import pandas
import os
from sqlalchemy import create_engine


def time_it(method):
    """decorator to measure time of execution"""
    def timed(*args, **kwargs):
        start = time.time()
        result = method(*args, **kwargs)
        end = time.time()
        print('method {} est:{}'.format(method.__name__, end - start))
        return result
    return timed


@time_it
def load_vocabulary(path='D:/vocabulary/'):
    """
    Load ATHENA vocabulary into Dataframe structure
    :param path - path to directory loaded from ATHENA
    """
    list = []
    for filename in os.listdir(path):
        if filename.endswith('.csv'):
            filepath = path + filename
            tablename = filename.replace('.csv', '')
            df = pandas.read_csv(filepath, sep='\t', dtype=str,
                                 na_filter=False)
            print(filepath)
            df.to_sql(tablename, con=connection, chunksize=5000)
            list.append(tablename)
    return list


@time_it
def load_report(filepath='D:/mdcr.xlsx'):
    """
    Load report from whiteRabbit to Dataframe, separate table for each sheet
    to acts like with a real tables
    :param - path to whiteRabbit report
    """
    xls = pandas.ExcelFile(filepath)
    sheets = xls.sheet_names
    for sheet in sheets:
        tablename = sheet
        df = pandas.read_excel(filepath, sheet, dtype=str, na_filter=False)
        df.to_sql(tablename, con=connection)


@time_it
def find_domain(column_name, table_name):
    """
    find target information by source code
    :param column_name - source code name column
    :param table_name - table where source code located
    """
    sql = open('SQL', 'r').read()
    res = connection.execute(sql.format(column_name, table_name)).fetchall()
    res.show()


if __name__ == '__main__':
    engine = create_engine('sqlite:///my.db', echo=False)
    connection = engine.connect()
    load_report()
    load_vocabulary()
    find_domain('dx1', 'facility_header')
    print('hi5')
    connection.close()
