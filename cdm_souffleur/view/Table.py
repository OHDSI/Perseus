class Table:
    def __init__(self, name: str, column_list: list = None):
        self.name = name
        if column_list is None:
            self.column_list = []
        else:
            self.column_list = column_list

    def to_json(self):
        return {'table_name': self.name,
                'column_list': [e.to_json() for e in self.column_list]}


class Column:
    def __init__(self, name: str, type_: str,
                 is_nullable: str = None):
        self.name = name
        self.type = type_
        self.is_nullable = is_nullable

    def to_json(self):
        if self.is_nullable is not None:
            description = {'column_name': self.name, 'column_type': self.type,
                           'is_column_nullable': self.is_nullable}
        else:
            description = {'column_name': self.name, 'column_type': self.type}
        return description
