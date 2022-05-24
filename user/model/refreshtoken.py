from peewee import AutoField, CharField, DateTimeField

from model.baseModel import BaseModel


class RefreshToken(BaseModel):
    id = AutoField()
    email = CharField(unique=True)
    refresh_token = CharField()
    expiration_date = DateTimeField()
