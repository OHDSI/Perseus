from model.usagi.atc_to_rxnorm import atc_to_rxnorm
from model.usagi.child import Child_Count
from model.usagi.concept import Concept as UConcept, Concept_Id_To_Atc_Code, Concept_For_Index, Valid_Concept_Ids
from model.usagi.relations import Maps_To_Relationship, Parent_Child_Relationship, Relationship_Atc_Rxnorm
from model.usagi.parent import Parent_Count

from model.usagi2.code_mapping_conversion import CodeMappingConversion
from model.usagi2.code_mapping_conversion_log import CodeMappingConversionLog
from model.usagi2.code_mapping_conversion_result import CodeMappingConversionResult
from model.usagi2.code_mapping_snapshot import CodeMappingSnapshot
from util.usagi_db import usagi_pg_db


def create_usagi_tables():
    usagi_pg_db.create_tables([
        Valid_Concept_Ids,
        Concept_Id_To_Atc_Code,
        Maps_To_Relationship,
        Relationship_Atc_Rxnorm,
        atc_to_rxnorm,
        Parent_Child_Relationship,
        Parent_Count,
        Child_Count,
        UConcept,
        Concept_For_Index,
    ])

def create_usagi2_tables():
    usagi_pg_db.create_tables([
        CodeMappingConversion,
        CodeMappingConversionLog,
        CodeMappingConversionResult,
        CodeMappingSnapshot,
    ])