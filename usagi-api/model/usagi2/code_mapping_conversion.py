from peewee import AutoField, CharField, IntegerField
from model.usagi2.usagi2_base_model import Usagi2BaseModel


class CodeMappingConversion(Usagi2BaseModel):
    id = AutoField()
    username = CharField()
    project = CharField()
    status_code = IntegerField()
    status_name = CharField(max_length=25)
