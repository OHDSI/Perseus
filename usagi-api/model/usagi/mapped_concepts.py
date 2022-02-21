from peewee import *
from model.user.user_base_model import UserBaseModel


# todo move table to usagi schema
class mapped_concept(UserBaseModel):
    id = AutoField()
    name = CharField()
    codes_and_mapped_concepts = TextField()
    username = CharField()
    created_on = DateTimeField()
