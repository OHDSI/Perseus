from peewee import *

from model.base_model import BaseModel


class UserDefinedLookup(BaseModel):
    id = AutoField()
    name = CharField()
    username = CharField(max_length=30)
    source_to_standard = TextField()
    source_to_source = TextField()

    class Meta:
        db_table = 'user_defined_lookups'
        indexes = (
            (('name', 'username'), True),
        )
