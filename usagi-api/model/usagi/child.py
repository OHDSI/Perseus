from peewee import IntegerField

from model.usagi.usagi_base_model import UsagiBaseModel


class Child_Count(UsagiBaseModel):
    ancestor_concept_id = IntegerField()
    child_count = IntegerField()
