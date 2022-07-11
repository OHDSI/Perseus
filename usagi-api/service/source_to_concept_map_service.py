from model.vocabulary.source_to_concept_map import SourceToConceptMap


def delete_source_to_concept_by_snapshot_name(snapshot_name: str, username: str):
    delete_rows_query = SourceToConceptMap \
        .delete() \
        .where((SourceToConceptMap.source_vocabulary_id == snapshot_name) & (SourceToConceptMap.username == username))
    delete_rows_query.execute()