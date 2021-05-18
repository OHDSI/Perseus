from peewee import *
from cdm_souffleur.model.baseModel import BaseModel


class refresh_token(BaseModel):

    id = AutoField()
    email = CharField(unique=True)
    refresh_token = CharField()
    expiration_date = DateTimeField()
