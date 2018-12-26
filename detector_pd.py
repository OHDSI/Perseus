from pyspark.sql import SparkSession
from pyspark import Row
from pyspark import SparkContext
import spark
import time
import pandas as pd
import os
import pandasql as pds


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
            code = "globals()['" + tablename + "'] = pd.read_csv('" + filepath + "', sep='\t', dtype=str, na_filter=False)"
            print(code)
            exec(code)
            list.append(tablename)
    return list


@time_it
def load_report(filepath='D:/mdcr.xlsx'):
    """
    Load report from whiteRabbit to Dataframe, separate table for each sheet
    to acts like with a real tables
    :param - path to whiteRabbit report
    """
    list = []
    xls = pd.ExcelFile(filepath)
    sheets = xls.sheet_names
    for sheet in sheets:
        tablename = sheet
        code = "globals()['" + tablename + "'] = pd.read_excel('" + filepath + "', '" + sheet + "', dtype=str, na_filter=False)"
        print(code)
        exec(code)
        list.append(tablename)
    return list


@time_it
def find_domain(column_name, table_name):
    """
    find target information by source code
    :param column_name - source code name column
    :param table_name - table where source code located
    """
    sql = open('SQL', 'r').read()
    res = pds.sqldf(sql.format(column_name, table_name), globals(), db_uri='sqlite:///my.db')
    res.show()


if __name__ == '__main__':
    lr = load_report()
    li = load_vocabulary()
    find_domain('dx1', 'facility_header')
