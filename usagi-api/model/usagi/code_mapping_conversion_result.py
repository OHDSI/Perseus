from datetime import datetime
from peewee import AutoField, TextField, DateTimeField, ForeignKeyField
from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.usagi_base_model import UsagiBaseModel


class CodeMappingConversionResult(UsagiBaseModel):
    id = AutoField()
    time = DateTimeField(default=datetime.now)
    result = TextField(),
    conversion = ForeignKeyField(CodeMappingConversion, backref='result')

    class Meta:
        db_table = 'code_mapping_conversion_result'
