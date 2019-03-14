from pathlib import Path
from pyspark import Row
import pandas
from cdm_souffleur.utils.utils import spark
import xml.etree.ElementTree as ElementTree
import os
import csv
import glob
import shutil


def get_source_schema():
    """return tables and columns of source schema based on WR report"""
    spark_ = spark()
    schema = {}
    load_report()
    for table in spark_.sql("""show tables""").collect():
        columns = [column.col_name for column in spark_.sql("""
            show columns from {}""".format(table.tableName)).collect()]
        schema[table.tableName] = columns
    print(schema)


def load_report(filepath=Path('D:/mdcr.xlsx')):
    """Load report from whiteRabbit to Dataframe, separate table for each sheet
    to acts like with a real tables"""
    report_list = []
    filepath_path = Path(filepath)
    xls = pandas.ExcelFile(filepath_path)
    sheets = xls.sheet_names
    for sheet in sheets:
        tablename = sheet
        df = pandas.read_excel(filepath_path, sheet)
        rdd_of_rows = _flatten_pd_df(df)
        spark_df = spark().createDataFrame(rdd_of_rows)
        spark_df.createOrReplaceTempView(tablename)
        report_list.append(tablename)
    return report_list


def _flatten_pd_df(pd_df: pandas.DataFrame):
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
            print(Path(root_dir) / filename)
            # TODO move all from replace to dict -> format query to run inside spark sql
            query = file_tree.find('Query').text.replace("""
join _chunks ch on ch.ChunkId = {0} and ENROLID = ch.PERSON_ID
""", '').replace("VARCHAR", "STRING").replace('&lt;', '<').replace(
                '&gt;', '>').replace('null as', '"" as')
            filtered_data = spark_.sql(query)
            print(filtered_data.printSchema)
            # TODO move write metadata to separete def
            with open(Path('generate/CDM_source_data/metadata') / (
                    filename + '.txt'), mode='x') as metadata_file:
                csv_writer = csv.writer(metadata_file, delimiter=',',
                                        quotechar='"')
                header = filtered_data.columns
                csv_writer.writerow(header)
            filtered_data.collect
            filtered_data.write.csv(
                str(Path('generate/CDM_source_data') / filename),
                compression='gzip', quote='`', nullValue='\0',
                dateFormat='yyyy-MM-dd')
            # TODO move rename to separate def
            old_filename = glob.glob(
                str(Path('generate/CDM_source_data') / filename / '*.gz'))
            print(str(Path('generate/CDM_source_data') / filename / '*.gz'))
            print(old_filename)
            new_filename = str(
                Path('generate/CDM_source_data') / (filename + '.gz'))
            os.rename(old_filename[0], new_filename)
            shutil.rmtree(str(Path('generate/CDM_source_data') / filename))


if __name__ == '__main__':
    # get_source_schema()
    prepare_source_data()
