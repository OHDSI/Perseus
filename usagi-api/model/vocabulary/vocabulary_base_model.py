from peewee import *
from util.vocabulary_db import vocabulary_pg_db


class VocabularyBaseModel(Model):
    class Meta:
        database = vocabulary_pg_db
        schema = 'vocabulary'
