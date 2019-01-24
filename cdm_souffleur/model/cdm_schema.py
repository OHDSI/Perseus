import pandas as pd
from pathlib import Path

cdm_version_list = ['4', '5.0.1', '5.1.0', '5.2.0', '5.3.0', '5.3.1', '5']
cdm_schema_path = Path('sources/CDM/')


def get_schema(cdm_version):
    """
    load CDM schema from csv
    """
    if cdm_version in cdm_version_list:
        path = cdm_schema_path / ('CDMv' + cdm_version + '.csv')
    else:
        raise ValueError('Version {} is not in {}'.format(cdm_version,
                                                          cdm_version_list))
    with open(path) as file:
        schema = pd.read_csv(file)
    return schema.groupby(['TABLE_NAME'])['COLUMN_NAME'].apply(list).to_dict()
    #return schema[['TABLE_NAME', 'COLUMN_NAME']]


def get_exist_version():
    """
    return existing versions of CDM schema
    """
    return cdm_version_list


if __name__ == '__main__':
    print(get_schema('5.0.1'))
    print(type(get_schema('5.0.1')))

