import pandas as pd
from cdm_souffleur.utils.constants import CDM_SCHEMA_PATH, CDM_VERSION_LIST
from cdm_souffleur.view.Table import Table, Column
from pathlib import Path


def get_exist_version():
    """return existing versions of CDM schema"""
    return CDM_VERSION_LIST


def get_schema(cdm_version):
    """load CDM schema from csv"""
    schema = []
    if cdm_version in CDM_VERSION_LIST:
        path = Path(CDM_SCHEMA_PATH / ('CDMv' + cdm_version + '.csv'))
    else:
        raise ValueError('Version {} is not in {}'.format(cdm_version,
                                                          CDM_VERSION_LIST))
    with open(path) as file:
        cdm_schema_description = pd.read_csv(file)
        cdm_schema_description['COLUMN_NAME_AND_TYPE'] = \
            cdm_schema_description['COLUMN_NAME'] + ':' + \
            cdm_schema_description['DATA_TYPE'] + ':' +\
            cdm_schema_description['IS_NULLABLE']
        tables_pd = cdm_schema_description.groupby(['TABLE_NAME'])[
            'COLUMN_NAME_AND_TYPE'].apply(list)
    for table_name, fields in tables_pd.items():
        table_ = Table(table_name)
        for field in fields:
            column_description = field.split(':')
            column_name = column_description[0]
            column_type = column_description[1]
            is_column_nullable = column_description[2]
            column = Column(column_name, column_type, is_column_nullable)
            table_.column_list.append(column)
        schema.append(table_)
    return schema


if __name__ == '__main__':
    for table in get_schema('5.0.1'):
        print(table.to_json())
