column_map = {
     16: 'bool',
     17: 'blob',
     20: 'bigint',
     21: 'smallint',
     23: 'int',
     25: 'text',
     700: 'real',
     701: 'double precision',
     1042: 'char',  # blank-padded CHAR
     1043: 'varchar',
     1082: 'date',
     1114: 'datetime',
     1184: 'datetime',
     1083: 'time',
     1266: 'time',
     1700: 'decimal',
     2950: 'uuid',  # UUID
},

postgres_types_mapping = {
     'BINARY': 'BYTEA',
     'BIT': 'BOOLEAN',
     'VARCHAR(MAX)': 'TEXT',
     'VARBINARY': 'BYTEA',
     'NVARCHAR': 'VARCHAR',
     'NTEXT': 'TEXT',
     'FLOAT': 'DOUBLE PRECISION',
     'DATETIME': 'TIMESTAMP(3)',
     'DATETIME2': 'TIMESTAMP',
     'DATETIMEOFFSET': 'TIMESTAMP(P) WITH TIME ZONE',
     'SMALLDATETIME': 'TIMESTAMP(0)',
     'TINYINT': 'SMALLINT',
     'UNIQUEIDENTIFIER': 'CHAR(16)',
     'ROWVERSION': 'BYTEA',
     'SMALLMONEY': 'MONEY',
     'IMAGE': 'BYTEA'
}