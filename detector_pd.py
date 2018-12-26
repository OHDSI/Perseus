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
            code = tablename + " = pd.read_csv('" + filepath + "', sep='\t'," \
                               " dtype=str, na_filter=False)"
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
    res = pysqldf(sql.format(column_name, table_name)).head()
    res.show()


if __name__ == '__main__':
    #pysqldf = lambda q: pds.sqldf(q, globals())
    #print(globals())
    lr = load_report()
    #print(locals())
    #print(globals())
    #print(red_book.head(10))
    #li = load_vocabulary()
    #print(li)
    #print(locals())
    #print(globals())
    #print(lr)
    #print(locals())
    #print(globals())
    #print(CONCEPT_CPT4.head(10))
    #print(pds.sqldf('select * from red_book', globals()))
    #print("----------------------------")
    #find_domain('dx1', 'facility_header')
    #print(locals())
    #print(globals())
    #exec('a = 47')
    #print(globals())
    #exec('Overview = pd.read_excel("D:/mdcr.xlsx", "Overview", dtype=str, na_filter=False)')
    print(pds.sqldf('select * from Overview', globals()))
    #print(globals())
    #print(a)
