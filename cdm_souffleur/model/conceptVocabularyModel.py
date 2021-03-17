from peewee import *
from cdm_souffleur.db import pg_db


class BaseModel(Model):
    class Meta:
        database = pg_db
        schema = 'vocabulary'


class Concept(BaseModel):
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


class Concept_Class(BaseModel):
    concept_class_id = CharField(primary_key=True)
    concept_class_name = CharField()
    concept_class_concept_id = IntegerField()


class Concept_Ancestor(BaseModel):
    ancestor_concept_id = IntegerField(primary_key=True)
    descendant_concept_id = IntegerField()
    min_levels_of_separation = IntegerField()
    max_levels_of_separation = IntegerField()


class Concept_Relationship(BaseModel):
    relationship_id = CharField(primary_key=True)
    concept_id_1 = IntegerField()
    concept_id_2 = IntegerField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()


class Concept_Synonym(BaseModel):
    language_concept_id = IntegerField(primary_key=True)
    concept_synonym_name = CharField()
    concept_id = IntegerField()


class Domain(BaseModel):
    domain_id = CharField(primary_key=True)
    domain_name = CharField()
    domain_concept_id = IntegerField()


class Drug_Strength(BaseModel):
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


class Relationship(BaseModel):
    relationship_id = CharField(primary_key=True)
    relationship_name = CharField()
    is_hierarchical = CharField()
    defines_ancestry = CharField()
    reverse_relationship_id = CharField()
    relationship_concept_id = IntegerField()


class Source_To_Concept_Map(BaseModel):
    source_concept_id = IntegerField(primary_key=True)
    source_code = CharField()
    source_vocabulary_id = CharField()
    source_code_description = CharField()
    target_concept_id = IntegerField()
    target_vocabulary_id = CharField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField()


class Vocabulary(BaseModel):
    vocabulary_id = CharField(primary_key=True)
    vocabulary_name = CharField()
    vocabulary_reference = CharField()
    vocabulary_version = CharField()
    vocabulary_concept_id = IntegerField()