from peewee import IntegerField, CharField, DateField, AutoField
from model.vocabulary.vocabulary_base_model import VocabularyBaseModel


class Source_To_Concept_Map(VocabularyBaseModel):
    id = AutoField(primary_key=True)
    source_concept_id = IntegerField()
    source_code = CharField()
    source_vocabulary_id = CharField()
    source_code_description = CharField(null=True)
    target_concept_id = IntegerField()
    target_vocabulary_id = CharField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField(null=True)
    username = CharField()