from pathlib import Path
from pyspark import Row
import pandas
from cdm_souffleur.utils.utils import spark
import xml.etree.ElementTree as ElementTree
import os


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
            query = file_tree.find('Query').text.replace("""

join _chunks ch on ch.ChunkId = {0} and ENROLID = ch.PERSON_ID

order by ENROLID""", '').replace("VARCHAR", "STRING").replace('&lt;', '<').replace('&gt;', '>')
            filtered_data = spark_.sql("""select CASE

WHEN DSTATUS = '01' THEN 'Discharged to home self care'

WHEN DSTATUS = '02' THEN 'Transfer to short term hospital'

WHEN DSTATUS = '03' THEN 'Transfer to SNF'

WHEN DSTATUS = '04' THEN 'Transfer to ICF'

WHEN DSTATUS = '05' THEN 'Transfer to other facility'

WHEN DSTATUS = '06' THEN 'Discharged home under care'

WHEN DSTATUS = '07' THEN 'Left against medical advice'

WHEN DSTATUS IN ('08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19') THEN 'Other alive status'

WHEN DSTATUS = '20' THEN 'Died'

WHEN DSTATUS = '21' THEN 'Discharged/transferred to court/law enforcement'

WHEN DSTATUS IN ('30', '31', '32', '33', '34', '35', '36', '37', '38', '39') THEN 'Still patient'

WHEN DSTATUS IN ('40', '41', '42') THEN 'Other died status'

WHEN DSTATUS = '43' THEN 'Discharged/transferred to federal hospital'

WHEN DSTATUS = '50' THEN 'Discharged to home (from Hospice)'

WHEN DSTATUS = '51' THEN 'Transfer to med fac (from Hospice)'

WHEN DSTATUS = '61' THEN 'Transfer to Medicare approved swing bed'

WHEN DSTATUS = '62' THEN 'Transferred to inpatient rehab facility (IRF)'

WHEN DSTATUS = '63' THEN 'Transferred to long term care hospital (LTCH)'

WHEN DSTATUS = '64' THEN 'Transferred to nursing facility Medicaid certified'

WHEN DSTATUS = '65' THEN 'Transferred to psychiatric hospital or unit'

WHEN DSTATUS = '66' THEN 'Transferred to critical access hospital (CAH)'

WHEN DSTATUS = '70' THEN 'Transfer to another facility NEC'

WHEN DSTATUS = '71' THEN 'Transfer/referred to other facility for outpt svcs'

WHEN DSTATUS = '72' THEN 'Transfer/referred to this facility for outpt svcs'

WHEN DSTATUS = '99' THEN 'Transfer (Hospital ID MDST change)'

ELSE NULL

END as VALUE_AS_STRING, 
 case
    when DSTATUS is null THEN 0
    else 1
    end as toObservation from facility_header""")
            print(filtered_data)
            #filtered_data.write.csv(Path('generate/CDM_source_data') / filename)


if __name__ == '__main__':
    prepare_source_data()
