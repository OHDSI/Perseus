from dataclasses import dataclass

from utils import InvalidUsage
from utils.constants import LOOKUP_MAX_LENGTH


@dataclass
class LookupRequest:
    name: str
    source_to_standard: str
    source_to_source: str


def from_json(json: dict) -> LookupRequest:
    to_standard = json['source_to_standard']
    to_source = json['source_to_source']
    if len(to_standard) > LOOKUP_MAX_LENGTH or len(to_source) > LOOKUP_MAX_LENGTH:
        raise InvalidUsage(f'Lookup query is too long. Max length is ${LOOKUP_MAX_LENGTH}.')

    return LookupRequest(
        name=json['name'],
        source_to_standard=to_standard,
        source_to_source=to_source
    )
