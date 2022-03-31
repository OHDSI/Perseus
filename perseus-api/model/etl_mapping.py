from peewee import *
from model.base_model import BaseModel


class EtlMapping(BaseModel):
    id = AutoField()
    name = CharField()
    username = CharField()
    cdm_version = CharField(max_length=10)
    scan_report_id = BigIntegerField()

