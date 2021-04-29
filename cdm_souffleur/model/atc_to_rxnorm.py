from peewee import *
from cdm_souffleur.model.BaseModelUsagi import BaseModelUsagi


class atc_to_rxnorm(BaseModelUsagi):

    concept_code = CharField()
    concept_id_2 = IntegerField()