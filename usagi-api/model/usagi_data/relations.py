from peewee import IntegerField

from model.usagi_data.usagi_data_base_model import UsagiDataBaseModel


class Maps_To_Relationship(UsagiDataBaseModel):
    concept_id_1 = IntegerField()
    concept_id_2 = IntegerField()


class Relationship_Atc_Rxnorm(UsagiDataBaseModel):
    concept_id_1 = IntegerField()
    concept_id_2 = IntegerField()


class Parent_Child_Relationship(UsagiDataBaseModel):
    ancestor_concept_id = IntegerField()
    descendant_concept_id = IntegerField()