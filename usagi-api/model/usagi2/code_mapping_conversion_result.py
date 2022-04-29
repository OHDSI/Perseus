from datetime import datetime
from peewee import AutoField, TextField, DateTimeField, ForeignKeyField
from model.usagi2.code_mapping_conversion import CodeMappingConversion
from model.usagi2.usagi2_base_model import Usagi2BaseModel


class CodeMappingConversionResult(Usagi2BaseModel):
    id = AutoField()
    time = DateTimeField(default=datetime.now)
    result = TextField(),
    conversion = ForeignKeyField(CodeMappingConversion, backref='result')