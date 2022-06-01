from peewee import IntegerField

from model.usagi_data.usagi_data_base_model import UsagiDataBaseModel


class Child_Count(UsagiDataBaseModel):
    ancestor_concept_id = IntegerField()
    child_count = IntegerField()
