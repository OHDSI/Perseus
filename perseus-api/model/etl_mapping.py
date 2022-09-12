from peewee import AutoField, CharField, BigIntegerField 

from model.base_model import BaseModel


class EtlMapping(BaseModel):
    id = AutoField()
    username = CharField()
    user_schema_name = CharField()
    source_schema_name = CharField(null=True)
    cdm_version = CharField(null=True)
    scan_report_name = CharField(null=True)
    scan_report_id = BigIntegerField(null=True)

    class Meta:
        db_table = 'etl_mappings'
