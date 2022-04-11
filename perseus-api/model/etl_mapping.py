from peewee import *
from model.base_model import BaseModel


class EtlMapping(BaseModel):
    id = AutoField()
    username = CharField(max_length=30)
    user_schema_name = CharField()
    source_schema_name = CharField()
    cdm_version = CharField(max_length=10, null=True)
    scan_report_name = CharField()
    scan_report_id = BigIntegerField()

    class Meta:
        db_table = 'etl_mappings'
