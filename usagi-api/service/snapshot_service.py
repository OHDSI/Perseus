import json

from model.usagi.code_mapping_snapshot import CodeMappingSnapshot
from util.exception import InvalidUsage


def get_snapshots_name_list(username: str):
    result = []
    saved_mapped_concepts = CodeMappingSnapshot \
        .select() \
        .where(CodeMappingSnapshot.username == username) \
        .order_by(CodeMappingSnapshot.time.desc())
    if saved_mapped_concepts.exists():
        for item in saved_mapped_concepts:
            result.append(item.name)
    return result


def get_snapshot(snapshot_name: str, username: str):
    saved_mapped_concepts = CodeMappingSnapshot \
        .select() \
        .where((CodeMappingSnapshot.username == username) & (CodeMappingSnapshot.name == snapshot_name))
    if saved_mapped_concepts.exists():
        codes_and_saved_mappings_string = saved_mapped_concepts.get().snapshot
        return json.loads(codes_and_saved_mappings_string)
    else:
        raise InvalidUsage('Vocabulary not found', 404)


def delete_snapshot(snapshot_name, current_user):
    delete_snapshot_query = CodeMappingSnapshot \
        .delete() \
        .where((CodeMappingSnapshot.username == current_user) & (CodeMappingSnapshot.name == snapshot_name))
    delete_snapshot_query.execute()