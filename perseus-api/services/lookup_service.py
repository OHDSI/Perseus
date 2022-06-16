import os
from pathlib import Path
from typing import List

from model.user_defined_lookup import UserDefinedLookup as Lookup
from services.request.lookup_request import LookupRequest
from services.response.lookup_list_item_response import LookupListItemResponse
from utils import InvalidUsage
from utils.constants import PREDEFINED_LOOKUPS_PATH, GENERATE_LOOKUP_SQL_PATH
from utils.exceptions import LookupNotFoundById


def get_lookups(lookup_type: str, username: str) -> List[LookupListItemResponse]:
    lookups_names_list = []

    def extract_lookups_from_server_directory(base_path):
        path = os.path.join(base_path, lookup_type)
        if os.path.isdir(path):
            files = os.listdir(path)
            lookups_names_list.extend(
                map(lambda x: LookupListItemResponse(id=None, name=f"{x.replace('.txt', '')}"), files)
            )

    def extract_lookups_from_database():
        select_query = Lookup.select().where(username == username)
        lookups_names_list.extend(
            [LookupListItemResponse(id=lookup.id, name=lookup.name) for lookup in select_query]
        )

    extract_lookups_from_server_directory(PREDEFINED_LOOKUPS_PATH)
    extract_lookups_from_database()

    return lookups_names_list


def get_lookup_by_id(id: int) -> Lookup:
    try:
        return Lookup.get(Lookup.id == id)
    except Exception:
        raise LookupNotFoundById(f'Lookup entity not found by id {id}.')


def get_lookup_sql(id: int, name: str, lookup_type: str) -> str:
    if id is not None:
        lookup = get_lookup_by_id(id)
        if lookup_type == 'source_to_standard':
            return lookup.source_to_standard
        elif lookup_type == 'source_to_source':
            return lookup.source_to_source
        else:
            raise InvalidUsage(f'Unsupported lookup type {lookup_type}')
    else:
        if 'template' in name:
            path = os.path.join(PREDEFINED_LOOKUPS_PATH, f"{name}.txt")
        else:
            path = os.path.join(PREDEFINED_LOOKUPS_PATH, lookup_type, f"{name}.txt")
        if os.path.isfile(path):
            lookup_value = ''
            with open(path, mode='r') as f:
                lookup_value = f.readlines()
            return ''.join(lookup_value)
        else:
            raise InvalidUsage(f'Lookup not found by name {name} and type {type}', 404)


def create_lookup(username: str, lookup_request: LookupRequest) -> Lookup:
    select_query = Lookup.select().where(
        Lookup.username == username,
        Lookup.name == lookup_request.name,
    )
    if select_query.exists():
        raise InvalidUsage(f"Lookup entity with name {lookup_request.name} already exist")
    lookup = Lookup(
        name=lookup_request.name,
        username=username,
        source_to_standard=lookup_request.source_to_standard,
        source_to_source=lookup_request.source_to_source
    )
    lookup.save()

    return lookup


def update_lookup(username: str, id: int, lookup_request: LookupRequest) -> Lookup:
    try:
        lookup: Lookup = Lookup.get(Lookup.id == id)
        if lookup.username != username:
            return create_lookup(username, lookup_request)
        else:
            lookup.source_to_standard = lookup_request.source_to_standard
            lookup.source_to_source = lookup_request.source_to_source
            lookup.save()

            return lookup
    except IndexError as e:
        raise InvalidUsage(f'Lookup entity not found by id {id}', 404, base=e)


def del_lookup(username: str, lookup_id: int):
    lookup: Lookup = Lookup.get(Lookup.id == lookup_id)
    if username != lookup.username:
        raise InvalidUsage('Can not delete lookup entity owned other user', 403)
    lookup.delete_instance()


def generate_lookup_file(lookup_json: dict, username: str):
    lookup_source_to_source_included = lookup_json['sourceToSourceIncluded'] \
        if 'sourceToSourceIncluded' in lookup_json \
        else ''
    lookup_name = lookup_json['name']

    if 'id' in lookup_json and lookup_json['id']:
        lookup_id = lookup_json['id']
        results_data = _get_user_defined_lookup(lookup_id, lookup_source_to_source_included)
    else:
        if not lookup_name:
            return
        results_data = _get_predefined_lookup(lookup_name, lookup_source_to_source_included)

    result_filepath = os.path.join(GENERATE_LOOKUP_SQL_PATH, username, f'{lookup_name}.sql')
    with open(result_filepath, mode='w') as f:
        f.write(results_data)


def generate_lookup_file_legacy(lookup_name: str, username: str):
    results_data = _get_predefined_lookup(lookup_name, False)
    result_filepath = os.path.join(GENERATE_LOOKUP_SQL_PATH, username, f'{lookup_name}.sql')
    with open(result_filepath, mode='w') as f:
        f.write(results_data)


def _get_user_defined_lookup(lookup_id: int, lookup_source_to_source_included: bool):
    lookup = get_lookup_by_id(lookup_id)
    path = PREDEFINED_LOOKUPS_PATH

    if lookup_source_to_source_included:
        template_filepath = os.path.join(path, 'template_result.txt')
        template_data = _get_predefined_lookup_data(template_filepath)

        results_data = _add_user_lookup_to_template('source_to_standard', lookup, template_data)
        results_data = _add_user_lookup_to_template('source_to_source', lookup, results_data)
    else:
        template_filepath = os.path.join(path, f'template_result_only_source_to_standard.txt')
        template_data = _get_predefined_lookup_data(template_filepath)

        results_data = _add_user_lookup_to_template('source_to_standard', lookup, template_data)

    return results_data


def _get_predefined_lookup(lookup_name: str, lookup_source_to_source_included: bool):
    path = PREDEFINED_LOOKUPS_PATH

    if lookup_source_to_source_included:
        template_filepath = os.path.join(path, 'template_result.txt')
        template_data = _get_predefined_lookup_data(template_filepath)

        results_data = _add_predefined_lookup_to_template('source_to_standard', path, lookup_name, template_data)
        results_data = _add_predefined_lookup_to_template('source_to_source', path, lookup_name, results_data)
    else:
        template_filepath = os.path.join(path, f'template_result_only_source_to_standard.txt')
        template_data = _get_predefined_lookup_data(template_filepath)

        results_data = _add_predefined_lookup_to_template('source_to_standard', path, lookup_name, template_data)

    return results_data


def _add_user_lookup_to_template(lookup_type: str, lookup: Lookup, template: str):
    lookup_body_filepath = os.path.join(PREDEFINED_LOOKUPS_PATH, f'template_{lookup_type}.txt')
    lookup_body_data = _get_predefined_lookup_data(lookup_body_filepath).split('\n\n')[1]

    lookup_data = lookup.source_to_standard if lookup_type == 'source_to_standard' else lookup.source_to_source

    replace_key = '{_}'.replace('_', lookup_type)
    return template.replace(replace_key, f'{lookup_body_data}{lookup_data}')


def _add_predefined_lookup_to_template(lookup_type: str, base_path: Path, lookup_name: str, template: str):
    lookup_body_filepath = os.path.join(PREDEFINED_LOOKUPS_PATH, f'template_{lookup_type}.txt')
    lookup_body_data = _get_predefined_lookup_data(lookup_body_filepath).split('\n\n')[1]

    lookup_filepath = os.path.join(base_path, lookup_type, f'{lookup_name}.txt')
    lookup_data = _get_predefined_lookup_data(lookup_filepath)

    replace_key = '{_}'.replace('_', lookup_type)
    return template.replace(replace_key, f'{lookup_body_data}{lookup_data}')


def _get_predefined_lookup_data(filepath):
    try:
        with open(filepath, mode='r') as f:
            return f.read()
    except Exception as e:
        raise InvalidUsage('Predefined lookup not found', 400, base=e)