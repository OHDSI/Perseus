from dataclasses import dataclass


@dataclass
class LookupListItemResponse:
    id: int or None
    name: str