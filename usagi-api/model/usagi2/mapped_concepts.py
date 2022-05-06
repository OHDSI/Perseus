from peewee import AutoField, CharField, TextField, DateTimeField
from model.usagi2.usagi2_base_model import Usagi2BaseModel


# todo move table to usagi schema
class mapped_concept(Usagi2BaseModel):
    id = AutoField()
    name = CharField()
    codes_and_mapped_concepts = TextField()
    username = CharField()
    created_on = DateTimeField()
