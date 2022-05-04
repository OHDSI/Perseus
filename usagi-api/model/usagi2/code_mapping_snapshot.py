from datetime import datetime
from peewee import AutoField, CharField, DateTimeField, TextField, ForeignKeyField
from model.usagi2.code_mapping_conversion import CodeMappingConversion
from model.usagi2.usagi2_base_model import Usagi2BaseModel


class CodeMappingSnapshot(Usagi2BaseModel):
    id = AutoField(),
    name = CharField()
    username = CharField()
    time = DateTimeField(default=datetime.now)
    snapshot = TextField()
    conversion = ForeignKeyField(CodeMappingConversion, backref='snapshot')