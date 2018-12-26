import pandas as pd
import spark
from pyspark.sql import SparkSession
from pyspark import Row
from pyspark import SparkContext
import pandas

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


def load_report(filepath = 'D:/mdcr.xlsx'):
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


if __name__ == '__main__':
    spark = SparkSession \
        .builder \
        .appName("Detect dictionary and vocabulary") \
        .getOrCreate()
    print(load_report())

