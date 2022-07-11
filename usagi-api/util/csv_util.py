import pandas as pd
from pandas.errors import EmptyDataError

from util.exception import InvalidUsage


def csv_to_list(filepath, delimiter):
    json_file = []
    try:
        data = pd.read_csv(filepath, delimiter=delimiter, error_bad_lines=False).fillna('')
        for row in data.iterrows():
            json_row = {}
            for col in data.columns:
                json_row[col] = str(row[1][col])
            json_file.append(json_row)
        return json_file
    except EmptyDataError as error:
        raise InvalidUsage('Empty CSV file', base=error)