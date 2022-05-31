from peewee import IntegerField

from model.usagi.usagi_base_model import UsagiBaseModel


class Maps_To_Relationship(UsagiBaseModel):
    concept_id_1 = IntegerField()
    concept_id_2 = IntegerField()


class Relationship_Atc_Rxnorm(UsagiBaseModel):
    concept_id_1 = IntegerField()
    concept_id_2 = IntegerField()


class Parent_Child_Relationship(UsagiBaseModel):
    ancestor_concept_id = IntegerField()
    descendant_concept_id = IntegerField()