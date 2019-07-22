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
    def __init__(self, name: str, type_: str,
                 is_nullable: str = None):
        self.name = name
        self.type = type_
        self.is_nullable = is_nullable

    def to_json(self):
        if self.is_nullable is not None:
            return {'column_name': self.name,
                    'column_type': self.type,
                    'is_column_nullable': self.is_nullable}
        else:
            return {'column_name': self.name,
                    'column_type': self.type}
