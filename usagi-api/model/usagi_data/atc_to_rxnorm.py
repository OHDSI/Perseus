from peewee import CharField, IntegerField, CompositeKey
from model.usagi_data.usagi_data_base_model import UsagiDataBaseModel


class atc_to_rxnorm(UsagiDataBaseModel):
    concept_code = CharField()
    concept_id_2 = IntegerField()

    class Meta:
        primary_key = CompositeKey('concept_code', 'concept_id_2')
