from peewee import *
from cdm_souffleur.model.baseModel import BaseModel

class mapped_concept(BaseModel):

    id = AutoField()
    name = CharField()
    codes_and_mapped_concepts = TextField()
    username = CharField()