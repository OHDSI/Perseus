from peewee import *
from model.usagi.usagi_base_model import UsagiBaseModel


class atc_to_rxnorm(UsagiBaseModel):
    concept_code = CharField()
    concept_id_2 = IntegerField()

    class Meta:
        primary_key = CompositeKey('concept_code', 'concept_id_2')
