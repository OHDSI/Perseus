from peewee import *

from util.usagi_db import usagi_pg_db


class UsagiBaseModel(Model):
    class Meta:
        database = usagi_pg_db
        schema = 'usagi'
