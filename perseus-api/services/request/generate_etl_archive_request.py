from dataclasses import dataclass
from typing import Any


@dataclass
class GenerateEtlArchiveRequest:
    name: str
    etl_mapping_id: int
    etl_configuration: Any


def from_json(json: dict):
    return GenerateEtlArchiveRequest(
                                    name=json['name'],
                                    etl_mapping_id=json['etl_mapping_id'],
                                    etl_configuration=json['etl_configuration']
                                    )