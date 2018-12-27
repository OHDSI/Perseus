import pandas as pd


def load_schema(path='D:/CDM6.csv'):
    """
    load CDM schema from csv("field","required","type","description","table")
    format from official page on GitHub
    """
    with open(path) as file:
        schema = pd.read_csv(file)
    return schema


if __name__ == '__main__':
    print(load_schema())

