from peewee import Model
from util.usagi_db import usagi_pg_db


class Usagi2BaseModel(Model):
    class Meta:
        database = usagi_pg_db
        schema = 'usagi2'
