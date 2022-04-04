from model.base_model import BaseModel
from peewee import *

from model.etl_mapping import EtlMapping


class UserDefinedLookup(BaseModel):
    name = CharField()
    file_id = BigIntegerField()
    etl_mapping_id = ForeignKeyField(EtlMapping, backref='lookups', object_id_name='etl_mapping_id')

    class Meta:
        db_table = 'user_defined_lookups'
