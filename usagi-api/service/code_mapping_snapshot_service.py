import json
from datetime import datetime

from model.usagi.code_mapping_conversion import CodeMappingConversion
from model.usagi.code_mapping_snapshot import CodeMappingSnapshot
from util.exception import InvalidUsage


def get_snapshots_name_list(username: str):
    result = []
    saved_mapped_concepts = CodeMappingSnapshot \
        .select() \
        .where(CodeMappingSnapshot.username == username) \
        .order_by(CodeMappingSnapshot.created_at.desc())
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


def create_or_update_snapshot(current_user: str,
                              codes,
                              mapping_params,
                              mapped_codes,
                              filters,
                              snapshot_name: str,
                              conversion: CodeMappingConversion) -> CodeMappingSnapshot:
    source_and_mapped_codes_dict = {
        'codes': codes,
        'mappingParams': mapping_params,
        'codeMappings': mapped_codes,
        'filters': filters,
        'conversionId': conversion.id
    }
    source_and_mapped_codes_string = json.dumps(source_and_mapped_codes_dict)
    existed_snapshot = CodeMappingSnapshot\
        .select()\
        .where((CodeMappingSnapshot.username == current_user) & (CodeMappingSnapshot.name == snapshot_name))

    if existed_snapshot.exists():
        existed_snapshot = existed_snapshot.get()
        existed_snapshot.snapshot = source_and_mapped_codes_string
        existed_snapshot.updated_at = datetime.now()
        existed_snapshot.save()
        return existed_snapshot
    else:
        new_snapshot = CodeMappingSnapshot(name=snapshot_name,
                                           snapshot=source_and_mapped_codes_string,
                                           username=current_user,
                                           conversion=conversion)
        new_snapshot.save()
        return new_snapshot


def delete_snapshot(snapshot_name, current_user):
    delete_snapshot_query = CodeMappingSnapshot \
        .delete() \
        .where((CodeMappingSnapshot.username == current_user) & (CodeMappingSnapshot.name == snapshot_name))
    delete_snapshot_query.execute()