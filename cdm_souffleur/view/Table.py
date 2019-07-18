class Table:
    def __init__(self, table_name: str, column_list: list):
        self.table_name = table_name
        self.column_list = column_list

    def __init__(self, table_name: str):
        self.table_name = table_name
        self.column_list = []

    def to_json(self):
        return {'table_name': self.table_name,
                'column_list': [e.to_json() for e in self.column_list]}


class Column:
    def __init__(self, column_name: str, column_type: str,
                 is_column_nullable: str = None):
        self.column_name = column_name
        self.column_type = column_type
        self.is_column_nullable = is_column_nullable

    def to_json(self):
        if self.is_column_nullable is not None:
            return {'column_name': self.column_name,
                    'column_type': self.column_type,
                    'is_column_nullable': self.is_column_nullable}
        else:
            return {'column_name': self.column_name,
                    'column_type': self.column_type}
