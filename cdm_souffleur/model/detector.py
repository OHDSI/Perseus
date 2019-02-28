from pyspark.sql import SparkSession
import os
from cdm_souffleur.utils import time_it
from pathlib import Path
from pyspark.sql.utils import AnalysisException


def init_spark():
    global spark
    spark = SparkSession \
        .builder \
        .appName("Detect dictionary and vocabulary") \
        .getOrCreate()


def load_vocabulary(path=r'D:\vocabulary\\'):
    """
    Load ATHENA vocabulary into Dataframe structure
    :param path - path to directory loaded from ATHENA
    """
    init_spark()
    vocabulary_list = []
    for filename in os.listdir(path):
        if filename.endswith('.csv'):
            filepath = str(Path(path) / filename)
            tablename = filename.replace('.csv', '')
            df = spark.read.csv(filepath, sep='\t', header=True,
                                inferSchema=True)
            df.createOrReplaceTempView(tablename)
            vocabulary_list.append(tablename)
    return vocabulary_list


def find_domain(column_name, table_name):
    """
    find target information by source code
    :param column_name - source code name column
    :param table_name - table where source code located
    """
    init_spark()
    sql = open('sources/SQL', 'r').read()
    # TODO: with few PC's should be used sql_broadcast instead sql
    # TODO: is it client-server or task cluster App?
    # sc: SparkContext = spark.sparkContext
    # sql_broadcast = sc.broadcast(sql)
    try:
        res = spark.sql(sql.format(column_name, table_name))
    except AnalysisException as error:
        # TODO what return if exception (no such table exsits)
        res = 'error'
        print(error)
    return res


if __name__ == '__main__':
    # TODO: detect configuration of PC and create effective entry point
    # cores = os.cpu_count()
    # init_spark()
    # load_report()
    # load_vocabulary()
    # find_domain('dx1', 'facility_header').show()
    print(find_domain.__doc__)
