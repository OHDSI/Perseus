from typing import List
from model.usagi_data.atc_to_rxnorm import atc_to_rxnorm
from model.usagi_data.source_code import SourceCode
from util.constants import CONCEPT_IDS


def create_source_codes(codes,
                        source_code_column,
                        source_name_column,
                        source_frequency_column,
                        auto_concept_id_column,
                        concept_ids_or_atc,
                        additional_info_columns) -> List[SourceCode]:
    source_codes = []
    for row in codes:
        if 'selected' in row:
            if row['selected']:
                source_code = add_source_code(row,
                                              source_code_column,
                                              source_name_column,
                                              source_frequency_column,
                                              auto_concept_id_column,
                                              concept_ids_or_atc,
                                              additional_info_columns,
                                              row)
                source_codes.append(source_code)
    return source_codes


def add_source_code(row,
                    source_code_column,
                    source_name_column,
                    source_frequency_column,
                    auto_concept_id_column,
                    concept_ids_or_atc,
                    additional_info_columns,
                    code) -> SourceCode:
    new_code = SourceCode()
    new_code.code = code
    if not source_code_column:
        new_code.source_code = ''
    else:
        new_code.source_code = row[source_code_column]
    new_code.source_name = row[source_name_column]
    if source_frequency_column:
        new_code.source_frequency = int(row[source_frequency_column])
    else:
        new_code.source_frequency = -1
    if auto_concept_id_column:
        if concept_ids_or_atc == CONCEPT_IDS:
            new_code.source_auto_assigned_concept_ids = set()
            for concept_id in str(row[auto_concept_id_column]).split(';'):
                if concept_id != "":
                    new_code.source_auto_assigned_concept_ids.add(
                        int(concept_id))
        else:
            concept_id_2_query = atc_to_rxnorm.select().where(atc_to_rxnorm.concept_code == row[auto_concept_id_column])
            for item in concept_id_2_query:
                new_code.source_auto_assigned_concept_ids = new_code.source_auto_assigned_concept_ids.add(
                    item.concept_id_2)
    if additional_info_columns:
        new_code.source_additional_info.append({additional_info_columns: row[additional_info_columns]})
    return new_code