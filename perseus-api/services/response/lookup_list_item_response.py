from dataclasses import dataclass

from model.user_defined_lookup import UserDefinedLookup


@dataclass
class LookupListItemResponse:
    id: int or None
    name: str


def from_user_defined_lookup(lookup: UserDefinedLookup):
    return LookupListItemResponse(id=lookup.id, name=lookup.name)
