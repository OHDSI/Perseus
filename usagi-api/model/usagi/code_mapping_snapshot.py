from datetime import datetime
from peewee import AutoField, CharField, DateTimeField, TextField, ForeignKeyField
from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.usagi_base_model import UsagiBaseModel


class CodeMappingSnapshot(UsagiBaseModel):
    id = AutoField(),
    name = CharField()
    username = CharField()
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)
    snapshot = TextField()
    conversion = ForeignKeyField(CodeMappingConversion, backref='snapshot')

    class Meta:
        db_table = 'code_mapping_snapshot'
