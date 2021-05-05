from peewee import *
from cdm_souffleur.db import pg_db

class BaseModelUsagi(Model):
    class Meta:
        database = pg_db
        schema = 'usagi'