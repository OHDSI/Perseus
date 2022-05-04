from peewee import AutoField, CharField, TextField, DateTimeField
from model.usagi.usagi_base_model import UsagiBaseModel


# todo move table to usagi schema
class mapped_concept(UsagiBaseModel):
    id = AutoField()
    name = CharField()
    codes_and_mapped_concepts = TextField()
    username = CharField()
    created_on = DateTimeField()
