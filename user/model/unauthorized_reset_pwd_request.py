from peewee import AutoField, CharField, DateTimeField
from model.baseModel import BaseModel


class UnauthorizedResetPwdRequest(BaseModel):
    report_id = AutoField()
    username = CharField()
    report_date = DateTimeField()

    class Meta:
        db_table = 'unauthorized_reset_pwd_request'
