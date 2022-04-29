from peewee import *
from model.vocabulary.vocabulary_base_model import VocabularyBaseModel


class Concept(VocabularyBaseModel):
    concept_id = IntegerField(primary_key=True)
    concept_name = TextField()
    domain_id = CharField()
    vocabulary_id = CharField()
    concept_class_id = CharField()
    standard_concept = CharField()
    concept_code = CharField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()


class Concept_Class(VocabularyBaseModel):
    concept_class_id = CharField(primary_key=True)
    concept_class_name = CharField()
    concept_class_concept_id = IntegerField()


class Concept_Ancestor(VocabularyBaseModel):
    ancestor_concept_id = IntegerField(primary_key=True)
    descendant_concept_id = IntegerField()
    min_levels_of_separation = IntegerField()
    max_levels_of_separation = IntegerField()


class Concept_Relationship(VocabularyBaseModel):
    relationship_id = CharField(primary_key=True)
    concept_id_1 = IntegerField()
    concept_id_2 = IntegerField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()


class Concept_Synonym(VocabularyBaseModel):
    language_concept_id = IntegerField(primary_key=True)
    concept_synonym_name = CharField()
    concept_id = IntegerField()


class Domain(VocabularyBaseModel):
    domain_id = CharField(primary_key=True)
    domain_name = CharField()
    domain_concept_id = IntegerField()


class Drug_Strength(VocabularyBaseModel):
    drug_concept_id = IntegerField(primary_key=True)
    ingredient_concept_id = IntegerField()
    amount_value = DoubleField()
    amount_unit_concept_id = IntegerField()
    numerator_value = DoubleField()
    numerator_unit_concept_id = IntegerField()
    denominator_value = DoubleField()
    denominator_unit_concept_id = IntegerField()
    box_size = IntegerField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()


class Relationship(VocabularyBaseModel):
    relationship_id = CharField(primary_key=True)
    relationship_name = CharField()
    is_hierarchical = CharField()
    defines_ancestry = CharField()
    reverse_relationship_id = CharField()
    relationship_concept_id = IntegerField()


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


class Vocabulary(VocabularyBaseModel):
    vocabulary_id = CharField(primary_key=True)
    vocabulary_name = CharField()
    vocabulary_reference = CharField()
    vocabulary_version = CharField()
    vocabulary_concept_id = IntegerField()