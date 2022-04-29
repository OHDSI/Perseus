from datetime import datetime
from peewee import AutoField, CharField, DateTimeField, IntegerField, ForeignKeyField
from model.usagi2.code_mapping_conversion import CodeMappingConversion
from model.usagi2.usagi2_base_model import Usagi2BaseModel


class CodeMappingConversionLog(Usagi2BaseModel):
    id = AutoField()
    message = CharField(max_length=1000)
    time = DateTimeField(default=datetime.now)
    status_code = IntegerField()
    status_name = CharField(max_length=25)
    percent = IntegerField(null=False)
    conversion = ForeignKeyField(CodeMappingConversion, backref='logs')
