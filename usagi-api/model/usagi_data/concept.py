from peewee import CharField, DateField, IntegerField, TextField

from model.usagi_data.usagi_data_base_model import UsagiDataBaseModel


class Concept(UsagiDataBaseModel):
    concept_id = IntegerField(primary_key=True)
    concept_name = TextField()
    domain_id = CharField()
    vocabulary_id = CharField()
    concept_class_id = CharField()
    standard_concept = CharField(null=True)
    concept_code = CharField()
    valid_start_date = DateField()
    valid_end_date = DateField()
    invalid_reason = CharField(null=True)
    parent_count = IntegerField(null=True)
    child_count = IntegerField(null=True)


class Valid_Concept_Ids(UsagiDataBaseModel):
    concept_id = IntegerField(primary_key=True)


class Concept_Id_To_Atc_Code(UsagiDataBaseModel):
    concept_id = IntegerField()
    concept_code = CharField()


class Concept_For_Index(UsagiDataBaseModel):
    type = CharField()
    term = TextField()
    concept_id = IntegerField()
    domain_id = CharField()
    vocabulary_id = CharField()
    concept_class_id = CharField()
    standard_concept = CharField(null=True)
    term_type = CharField()