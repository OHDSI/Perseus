from peewee import *
from db import pg_db

class BaseModel(Model):
    class Meta:
        database = pg_db
        schema = 'user'