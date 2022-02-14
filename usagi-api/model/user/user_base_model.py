from peewee import *
from util.user_db import user_db


class UserBaseModel(Model):
    class Meta:
        database = user_db
        schema = 'cdm'