import postgresql
import os
import pandas as pd
from pathlib import Path
from pyspark.sql.utils import AnalysisException
from cdm_souffleur.utils.utils import spark
from cdm_souffleur.utils.constants import VOCABULARY_DESCRIPTION_PATH
from sqlalchemy import create_engine


def load_vocabulary(path=r'D:\vocabulary\\'):
    # meanwhile not in use - only DB or direct file
    """Load ATHENA vocabulary into Dataframe structure
    :param path - path to directory loaded from ATHENA
    """
    vocabulary_list = []
    for filename in os.listdir(path):
        if filename.endswith('.csv'):
            filepath = str(Path(path) / filename)
            tablename = filename.replace('.csv', '')
            df = spark().read.csv(filepath, sep='\t', header=True,
                                  inferSchema=True)
            df.createOrReplaceTempView(tablename)
            vocabulary_list.append(tablename)
    return vocabulary_list


def return_lookup_list(connection_string):
    """Return ATHENA vocabulary lookup list"""
    if connection_string is None:
        vocabulary_description = pd.read_csv(VOCABULARY_DESCRIPTION_PATH,
                                             sep='\t')
        lookup_list = vocabulary_description['vocabulary_id'].values.tolist()
    else:
        db = postgresql.open(f'pq://{connection_string}')
        concept = db.query("select * from vocabulary")
        lookup_list = [row['vocabulary_id'] for row in concept]
    return lookup_list


def return_domain_list(connection_string):
    """Return ATHENA domain list"""
    db = postgresql.open(f'pq://{connection_string}')
    domain = db.query("select domain_id from domain")
    domain_list = [row[0] for row in domain]
    return domain_list


def return_concept_class_list(connection_string):
    """Return ATHENA concept class list"""
    db = postgresql.open(f'pq://{connection_string}')
    domain = db.query("select concept_class_id from concept_class")
    domain_list = [row[0] for row in domain]
    return domain_list


def find_domain(column_name, table_name):
    """find target information by source code
    :param column_name - source code name column
    :param table_name - table where source code located
    both vocabulary and report should be loaded to spark warehouse
    """
    db = create_engine(f'postgresql+pypostgresql://postgres:root@10.110.1.76:5432/Vocabulary')
    sql = open('model/sources/SQL', 'r').read()
    # TODO: with few PC's should be used sql_broadcast instead sql
    # TODO: is it client-server or task cluster App?
    # sc: SparkContext = spark.sparkContext
    # sql_broadcast = sc.broadcast(sql)
    try:
        # res = spark().sql(sql.format(column_name, table_name))
        res = pd.read_sql(sql.format(column_name, table_name), con=db)
    except AnalysisException:
        raise
    return res


if __name__ == '__main__':
    # TODO: detect configuration of PC and create effective entry point
    # cores = os.cpu_count()
    # init_spark()
    from cdm_souffleur.model.source_schema import load_report

    #load_report()
    print(return_lookup_list())
    #find_domain('dx1', 'facility_header').show()
    # print(find_domain.__doc__)
