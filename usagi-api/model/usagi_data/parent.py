from peewee import IntegerField

from model.usagi_data.usagi_data_base_model import UsagiDataBaseModel


class Parent_Count(UsagiDataBaseModel):
    descendant_concept_id = IntegerField()
    parent_count = IntegerField()
