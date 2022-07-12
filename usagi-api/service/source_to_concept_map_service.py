from model.vocabulary.source_to_concept_map import SourceToConceptMap
from util.vocabulary_db import vocabulary_pg_db


def save_source_to_concept_map(mapped_codes, snapshot_name: str, username: str):
    with vocabulary_pg_db.atomic():
        delete_source_to_concept_by_snapshot_name(snapshot_name, username)

        for item in mapped_codes:
            if 'approved' in item and item['approved']:
                source_code = item['sourceCode']['source_code']
                source_code_description = item['sourceCode']['source_name']
                for concept in item['targetConcepts']:
                    mapped_code_data = {
                        "source_concept_id": 0,
                        "source_code": source_code,
                        "source_vocabulary_id": snapshot_name,
                        "source_code_description": source_code_description,
                        "target_concept_id": concept['concept']['conceptId'],
                        "target_vocabulary_id": "None" if concept['concept']['vocabularyId'] == "0" else
                        concept['concept']['vocabularyId'],
                        "valid_start_date": "1970-01-01",
                        "valid_end_date": "2099-12-31",
                        "invalid_reason": "",
                        "username": username
                    }
                    SourceToConceptMap.create(**mapped_code_data)


def delete_source_to_concept_by_snapshot_name(snapshot_name: str, username: str):
    delete_rows_query = SourceToConceptMap \
        .delete() \
        .where((SourceToConceptMap.source_vocabulary_id == snapshot_name) & (SourceToConceptMap.username == username))
    delete_rows_query.execute()
