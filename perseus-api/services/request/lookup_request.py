from dataclasses import dataclass


@dataclass
class LookupRequest:
    name: str
    source_to_standard: str
    source_to_source: str


def from_json(json: dict) -> LookupRequest:
    return LookupRequest(
        name=json['name'],
        source_to_standard=json['source_to_standard'],
        source_to_source=json['source_to_source']
    )
