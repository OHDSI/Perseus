from datetime import datetime
from peewee import AutoField, CharField, DateTimeField, IntegerField, ForeignKeyField
from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.usagi_base_model import UsagiBaseModel


class CodeMappingConversionLog(UsagiBaseModel):
    id = AutoField()
    message = CharField(max_length=1000)
    time = DateTimeField(default=datetime.now)
    status_code = IntegerField()
    status_name = CharField(max_length=25)
    percent = IntegerField(null=False)
    conversion = ForeignKeyField(CodeMappingConversion, backref='logs')

    class Meta:
        db_table = 'code_mapping_conversion_log'
