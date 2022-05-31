import pandas as pd
from peewee import fn

from db_engines import vocabulary_engine, usagi_engine

from model.usagi.atc_to_rxnorm import atc_to_rxnorm
from model.usagi.child import Child_Count
from model.usagi.concept import Concept as UConcept, Concept_Id_To_Atc_Code, Concept_For_Index, Valid_Concept_Ids
from model.usagi.relations import Maps_To_Relationship, Parent_Child_Relationship, Relationship_Atc_Rxnorm
from model.usagi.parent import Parent_Count

from model.vocabulary.concept_vocabulary_model import Concept, Concept_Relationship, Concept_Ancestor, Concept_Synonym

from util.constants import INSERT_BATCH_SIZE
from util.usagi_db import usagi_pg_db


valid_concept_records = []

def create_rows_for_tables():
    create_valid_concept_ids()
    create_concept_id_to_atc_code()
    create_maps_to_relationship()
    create_relationship_atc_rxnorm()
    create_atc_to_rxnorm()
    create_parent_child_relationship()
    create_parent_count()
    create_child_count()
    create_usagi_concept()
    create_concept_for_index()
    create_concept_for_index_2()
    create_concept_for_index_3()
    create_concept_for_index_4()


def create_valid_concept_ids():
    records = Concept.select(Concept.concept_id).where(Concept.invalid_reason.is_null(True)).dicts()
    global valid_concept_records
    valid_concept_records = [record["concept_id"] for record in records]
    if Valid_Concept_Ids.select().count() == 0:
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Valid_Concept_Ids.insert_many(rows).execute()

def create_concept_id_to_atc_code():
    if Concept_Id_To_Atc_Code.select().count() == 0:
        records = Concept.select(Concept.concept_id, Concept.concept_code).where((Concept.invalid_reason.is_null(True)) & (Concept.vocabulary_id=='ATC')).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Concept_Id_To_Atc_Code.insert_many(rows).execute()

def create_maps_to_relationship():
    if Maps_To_Relationship.select().count() == 0:
        records = Concept_Relationship.select(
            Concept_Relationship.concept_id_1, Concept_Relationship.concept_id_2
        ).where((
                Concept_Relationship.relationship_id=='Maps to'
            ) & (
                Concept_Relationship.invalid_reason.is_null(True)
            ) & (
                Concept_Relationship.concept_id_1!=Concept_Relationship.concept_id_2
             ) & (
                Concept_Relationship.concept_id_1.in_(valid_concept_records)
            ) & (
                Concept_Relationship.concept_id_2.in_(valid_concept_records)
            )
        ).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Maps_To_Relationship.insert_many(rows).execute()


def create_relationship_atc_rxnorm():
    if Relationship_Atc_Rxnorm.select().count() == 0:
        records = Concept_Relationship.select(
            Concept_Relationship.concept_id_1, Concept_Relationship.concept_id_2
        ).where((
                Concept_Relationship.relationship_id=='ATC - RxNorm'
            ) & (
                Concept_Relationship.invalid_reason.is_null(True)
            ) & (
                Concept_Relationship.concept_id_1!=Concept_Relationship.concept_id_2
            ) & (
                Concept_Relationship.concept_id_1.in_(valid_concept_records)
            ) & (
                Concept_Relationship.concept_id_2.in_(valid_concept_records)
            )
        ).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Relationship_Atc_Rxnorm.insert_many(rows).execute()


def create_atc_to_rxnorm():
    if atc_to_rxnorm.select().count() == 0:
        records = Concept_Id_To_Atc_Code.select(
            Concept_Id_To_Atc_Code.concept_code, Relationship_Atc_Rxnorm.concept_id_2
        ).join(Relationship_Atc_Rxnorm, on=(
                Concept_Id_To_Atc_Code.concept_id==Relationship_Atc_Rxnorm.concept_id_1
            )
        ).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                atc_to_rxnorm.insert_many(rows).execute()


def create_parent_child_relationship():
    if Parent_Child_Relationship.select().count() == 0:
        records = Concept_Ancestor.select(
            Concept_Ancestor.ancestor_concept_id, Concept_Ancestor.descendant_concept_id
        ).where(
            (
                Concept_Ancestor.min_levels_of_separation==1
            ) & (
                Concept_Ancestor.ancestor_concept_id!=Concept_Ancestor.descendant_concept_id
            ) & (
                Concept_Ancestor.ancestor_concept_id.in_(valid_concept_records)
            ) & (
                Concept_Ancestor.descendant_concept_id.in_(valid_concept_records)
            )
        ).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Parent_Child_Relationship.insert_many(rows).execute()


def create_parent_count():
    if Parent_Count.select().count() == 0:
        records = Parent_Child_Relationship.select(
            Parent_Child_Relationship.descendant_concept_id,
            fn.COUNT(Parent_Child_Relationship.ancestor_concept_id).alias('parent_count')
        ).group_by(Parent_Child_Relationship.descendant_concept_id).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Parent_Count.insert_many(rows).execute()


def create_child_count():
    if Child_Count.select().count() == 0:
        records = Parent_Child_Relationship.select(
            Parent_Child_Relationship.ancestor_concept_id,
            fn.COUNT(Parent_Child_Relationship.descendant_concept_id).alias('child_count')
        ).group_by(Parent_Child_Relationship.ancestor_concept_id).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Child_Count.insert_many(rows).execute()


def create_usagi_concept():
    if UConcept.select().count() == 0:
        parent_count_records = pd.read_sql_table('parent_count', usagi_engine, 'usagi')
        child_count_records = pd.read_sql_table('child_count', usagi_engine, 'usagi')
        vconcept_records = pd.read_sql_table('concept', vocabulary_engine, 'vocabulary')
        records = vconcept_records.merge(parent_count_records, how='outer', left_on='concept_id', right_on='descendant_concept_id')
        parent_count_records = None
        vconcept_records = None
        records = records.merge(child_count_records, how='outer', left_on='concept_id', right_on='ancestor_concept_id')
        child_count_records = None
        records.drop(['id_x', 'id_y', 'descendant_concept_id', 'ancestor_concept_id'], axis=1, inplace=True)
        records.to_sql('concept', usagi_engine, 'usagi', chunksize=1000, index=False, if_exists='append')


def create_concept_for_index():
    if Concept_For_Index.select().where((Concept_For_Index.type=='C') & (Concept_For_Index.term_type=='C')).count() == 0:
        records = UConcept.select(
            UConcept.concept_name.alias('term'), UConcept.concept_id, UConcept.domain_id,
            UConcept.vocabulary_id, UConcept.concept_class_id, UConcept.standard_concept
        ).where(UConcept.standard_concept.in_(('S', 'C'))).dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Concept_For_Index.insert_many([{"type": 'C', "term_type": 'C', **row} for row in rows]).execute()


def create_concept_for_index_2():
    if Concept_For_Index.select().where((Concept_For_Index.type=='S') & (Concept_For_Index.term_type=='C')).count() == 0:
        t1 = UConcept.alias()
        t2 = Maps_To_Relationship.alias()
        t3 = UConcept.alias()
        records = t1.select(
            t1.concept_name.alias('term'), t3.concept_id, t3.domain_id,
            t3.vocabulary_id, t3.concept_class_id, t3.standard_concept
        ).join(
            t2, on=(t1.concept_id==t2.concept_id_1)
        ).join(
            t3, on=(t2.concept_id_2==t3.concept_id)
        ).where(
            (
                t1.standard_concept.is_null(True)
            ) & (
                fn.LOWER(t1.concept_name)!=fn.LOWER(t3.concept_name)
            )
        ).distinct().dicts()
        with usagi_pg_db.atomic():
            for idx in range(0, len(records), INSERT_BATCH_SIZE):
                rows = records[idx:idx + INSERT_BATCH_SIZE]
                Concept_For_Index.insert_many([{"type": 'S', "term_type": 'C', **row} for row in rows]).execute()


def create_concept_for_index_3():
    if Concept_For_Index.select().join(
        UConcept, on=(Concept_For_Index.concept_id==UConcept.concept_id)
    ).where((
        Concept_For_Index.type=='C') & (
        Concept_For_Index.term_type=='C') & (
        Concept_For_Index.standard_concept.in_(('S', 'C'))) & (
        fn.LOWER(Concept_For_Index.term)!=fn.LOWER(UConcept.concept_name))
    ).count() == 0:
        concept_synonym_records = pd.read_sql_table('concept_synonym', vocabulary_engine, 'vocabulary')
        uconcept_records = pd.read_sql_table('concept', usagi_engine, 'usagi')
        records = uconcept_records.merge(concept_synonym_records, how='inner', on='concept_id')
        concept_synonym_records = None
        uconcept_records = None
        records = records.loc[(records['concept_name'].str.lower() != records['concept_synonym_name'].str.lower()) &
              records['standard_concept'].isin(['S', 'C'])]
        records.drop([
            'parent_count',
            'child_count',
            'concept_code',
            'invalid_reason',
            'valid_end_date',
            'valid_start_date',
            'concept_name',
            'language_concept_id'
            ], axis=1, inplace=True)
        records.rename(columns={'concept_synonym_name': 'term'}, inplace=True)
        records["type"] = "C"
        records["term_type"] = "C"
        records.to_sql('concept_for_index', usagi_engine, 'usagi', chunksize=1000, index=False, if_exists='append')


def create_concept_for_index_4():
    if Concept_For_Index.select().join(
        UConcept, on=(Concept_For_Index.concept_id==UConcept.concept_id)
    ).where((
        Concept_For_Index.type=='C') & (
        Concept_For_Index.term_type=='S') & (
        UConcept.standard_concept.is_null(True)) & (
        fn.LOWER(Concept_For_Index.term)!=fn.LOWER(UConcept.concept_name))
    ).count() == 0:
        concept_synonym_records = pd.read_sql_table('concept_synonym', vocabulary_engine, 'vocabulary')
        uconcept_records_1 = pd.read_sql_table('concept', usagi_engine, 'usagi', columns=['standard_concept', 'concept_id'])
        uconcept_records_1.rename(columns={'standard_concept': 'standard_concept_1'}, inplace=True)
        records = uconcept_records_1.merge(concept_synonym_records, how='inner', on='concept_id')
        concept_synonym_records = None
        uconcept_records_1 = None
        maps_to_rels_records = pd.read_sql_table('maps_to_relationship', usagi_engine, 'usagi')
        records = records.merge(maps_to_rels_records, how='inner', left_on='concept_id', right_on='concept_id_1')
        maps_to_rels_records = None
        uconcept_records_2 = pd.read_sql_table('concept', usagi_engine, 'usagi', columns=[
                                                                                         'concept_id',
                                                                                         'concept_name',
                                                                                         'domain_id',
                                                                                         'vocabulary_id',
                                                                                         'concept_class_id',
                                                                                         'standard_concept'
                                                                                         ])
        records = records.merge(uconcept_records_2, how='inner', left_on='concept_id_2', right_on='concept_id')
        records = records.loc[(records['concept_name'].str.lower() != records['concept_synonym_name'].str.lower()) &
              records['standard_concept_1'].isna()]
        records.drop([
            'id',
            'standard_concept_1',
            'language_concept_id',
            'concept_id_1',
            'concept_id_2',
            'concept_id_x',
            'concept_name'
            ], axis=1, inplace=True)
        records.rename(columns={'concept_synonym_name': 'term', 'concept_id_y': 'concept_id'}, inplace=True)
        records["type"] = "C"
        records["term_type"] = "S"
        records.to_sql('concept_for_index', usagi_engine, 'usagi', chunksize=1000, index=False, if_exists='append')
