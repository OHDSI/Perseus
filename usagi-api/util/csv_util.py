import os

import pandas as pd
from pandas.errors import EmptyDataError

from util.exception import InvalidUsage


def csv_to_list(filepath, delimiter):
    json_array = []
    try:
        data = pd.read_csv(filepath, delimiter=delimiter, error_bad_lines=False,
                           skipinitialspace=True, encoding="utf-8").fillna('')
        for row in data.iterrows():
            json_row = {}
            for col in data.columns:
                json_row[col] = str(row[1][col]).strip()
            json_array.append(json_row)
        return json_array
    except EmptyDataError as error:
        os.remove(filepath)
        raise InvalidUsage('Empty CSV file', base=error)