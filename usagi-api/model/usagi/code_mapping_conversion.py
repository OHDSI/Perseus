from peewee import AutoField, CharField, IntegerField
from model.usagi.usagi_base_model import UsagiBaseModel


class CodeMappingConversion(UsagiBaseModel):
    id = AutoField()
    username = CharField()
    status_code = IntegerField()
    status_name = CharField(max_length=25)

    class Meta:
        db_table = 'code_mapping_conversion'
