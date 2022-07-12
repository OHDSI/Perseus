from peewee import Model
from util.vocabulary_db import vocabulary_pg_db


class UsagiDataBaseModel(Model):
    class Meta:
        database = vocabulary_pg_db
        schema = 'usagi_data'
