from peewee import *
from model.usagi.usagi_base_model import UsagiBaseModel


class Concept(UsagiBaseModel):
    concept_id = IntegerField(primary_key=True)
    concept_name = TextField()
    domain_id = CharField()
    vocabulary_id = CharField()
    concept_class_id = CharField()
    standard_concept = CharField()
    concept_code = CharField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()
    parent_count = IntegerField()
    child_count = IntegerField()
