import os

from model.user_defined_lookup import UserDefinedLookup as Lookup
from services.request.lookup.lookup_request import LookupRequest
from services.response.lookup_list_item_response import LookupListItemResponse
from utils import InvalidUsage
from utils.constants import PREDEFINED_LOOKUPS_PATH


def get_lookups_names(lookup_type: str, username: str):
    lookups_names_list = []

    def extract_lookups_from_server_directory(base_path):
        path = os.path.join(base_path, lookup_type)
        if os.path.isdir(path):
            files = os.listdir(path)
            lookups_names_list.extend(
                map(lambda x: LookupListItemResponse(id=None, name=f"{x.replace('.txt', '')}"), files)
            )

    def extract_lookups_from_database():
        select_query = Lookup.select().where(username == username, lookup_type == lookup_type)
        lookups_names_list.extend(
            [LookupListItemResponse(id=lookup.id, name=lookup.name) for lookup in select_query]
        )

    extract_lookups_from_server_directory(PREDEFINED_LOOKUPS_PATH)
    extract_lookups_from_database()

    return lookups_names_list


def get_lookup_sql(id: int, name: str, lookup_type: str) -> str:
    if id is not None:
        try:
            lookup: Lookup = Lookup.get(Lookup.id == id)
            return lookup.value
        except IndexError:
            raise InvalidUsage(f'Lookup entity not found by id {id}', 404)
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
            return lookup.update(
                name=lookup_request.name,
                username=username,
                source_to_standard=lookup_request.source_to_standard,
                source_to_source=lookup_request.source_to_source
            )
    except IndexError:
        raise InvalidUsage(f'Lookup entity not found by id {id}', 404)


def del_lookup(username: str, lookup_id: int):
    lookup: Lookup = Lookup.get(Lookup.id == lookup_id)
    if username != lookup.username:
        raise InvalidUsage('Can not delete lookup entity owned other user', 403)
    lookup.delete()
