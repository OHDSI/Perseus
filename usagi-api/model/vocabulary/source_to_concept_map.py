from peewee import *
from model.vocabulary.vocabulary_base_model import VocabularyBaseModel


class Source_To_Concept_Map(VocabularyBaseModel):
    source_concept_id = IntegerField()
    source_code = CharField()
    source_vocabulary_id = CharField()
    source_code_description = CharField()
    target_concept_id = IntegerField()
    target_vocabulary_id = CharField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()
    username = CharField()
    id = AutoField()