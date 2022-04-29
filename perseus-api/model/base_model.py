from peewee import Model

from db import app_logic_db


class BaseModel(Model):
    class Meta:
        database = app_logic_db
        schema = 'perseus'
