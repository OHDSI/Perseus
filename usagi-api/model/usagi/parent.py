from peewee import IntegerField

from model.usagi.usagi_base_model import UsagiBaseModel


class Parent_Count(UsagiBaseModel):
    descendant_concept_id = IntegerField()
    parent_count = IntegerField()
