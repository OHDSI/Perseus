from pathlib import Path

import spark
from pyspark.sql import SparkSession
from pyspark import Row
import pandas

from cdm_souffleur.model.detector import init_spark
from cdm_souffleur.utils import time_it


def get_source_schema():
    pass


@time_it
def load_report(filepath=Path('D:/mdcr.xlsx')):
    """
    Load report from whiteRabbit to Dataframe, separate table for each sheet
    to acts like with a real tables
    :param - path to whiteRabbit report
    """
    init_spark()
    report_list = []
    xls = pandas.ExcelFile(Path(filepath))
    sheets = xls.sheet_names
    for sheet in sheets:
        tablename = sheet
        df = pandas.read_excel(filepath, sheet)
        rdd_of_rows = _flatten_pd_df(df)
        spark_df = spark.createDataFrame(rdd_of_rows)
        spark_df.createOrReplaceTempView(tablename)
        report_list.append(tablename)
    return report_list


def _flatten_pd_df(pd_df: pandas.DataFrame):
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


if __name__ == '__main__':
    spark = SparkSession \
        .builder \
        .appName("Detect dictionary and vocabulary") \
        .getOrCreate()
    # TODO move below code to get_source schema method
    # TODO think about one entry point for spark methods
    schema = {}
    load_report()
    for table in spark.sql("""show tables""").collect():
        columns = [column.col_name for column in spark.sql("""
            show columns from {}""".format(table.tableName)).collect()]
        schema[table.tableName] = columns
    print(schema)













