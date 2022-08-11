from dataclasses import dataclass


@dataclass
class SetCdmVersionRequest:
    etl_mapping_id: int
    cdm_version: str


def from_json(json: dict):
    return SetCdmVersionRequest(
        etl_mapping_id=json['etlMappingId'],
        cdm_version=json['cdmVersion']
    )