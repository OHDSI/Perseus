from peewee import *
from cdm_souffleur.db import pg_db

class BaseModel(Model):
    class Meta:
        database = pg_db
        schema = 'cdm'