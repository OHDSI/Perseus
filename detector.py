from pyspark.sql import SparkSession
from pyspark import Row
from pyspark import SparkContext
import time
import pandas
import os


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
            df = spark.read.csv(filepath, sep='\t', header=True,
                                inferSchema=True)
            df.createOrReplaceTempView(tablename)
            list.append(tablename)
    return list


def flatten_pd_df(pd_df: pandas.DataFrame):
    """
    Given a Pandas DF that has appropriately named columns, this function will
    iterate the rows and generate Spark Row
    objects.  It's recommended that this method be invoked via Spark's flatMap
    :param pd_df:
    :return:
    """
    rows = []
    for index, series in pd_df.iterrows():
        # Takes a row of a df, exports it as a dict, and then passes an
        # unpacked-dict into the Row constructor
        row_dict = {str(k): str(v) for k, v in series.to_dict().items()}
        rows.append(Row(**row_dict))
    return rows


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
        df = pandas.read_excel(filepath, sheet)
        rdd_of_rows = flatten_pd_df(df)
        spark_df = spark.createDataFrame(rdd_of_rows)
        spark_df.createOrReplaceTempView(tablename)


@time_it
def find_domain(column_name, table_name):
    """
    find target information by source code
    :param column_name - source code name column
    :param table_name - table where source code located
    """
    sql = open('SQL', 'r').read()
    sc: SparkContext = spark.sparkContext
    sql_broadcast = sc.broadcast(sql)
    res = spark.sql(sql_broadcast.value.format(column_name, table_name))
    res.show()


@time_it
def fd_spark(column_name, table_name):
    load_vocabulary()
    load_report()
    sql = open('SQL', 'r').read()
    sc: SparkContext = spark.sparkContext
    sql_broadcast = sc.broadcast(sql)
    res = spark.sql(sql_broadcast.value.format(column_name, table_name))
    res.show()


if __name__ == '__main__':
    #define entri point
    cores = os.cpu_count()
    spark = SparkSession \
        .builder \
        .appName("Detect dictionary and vocabulary") \
        .getOrCreate()
    load_report()
    load_vocabulary()
    find_domain('dx1', 'facility_header')
