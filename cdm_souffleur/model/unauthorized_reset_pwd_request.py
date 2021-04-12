from peewee import AutoField, CharField, DateTimeField
from cdm_souffleur.model.baseModel import BaseModel

class unauthorized_reset_pwd_request(BaseModel):
    report_id = AutoField()
    username = CharField()
    report_date = DateTimeField()