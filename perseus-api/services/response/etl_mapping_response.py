from dataclasses import dataclass

from model.etl_mapping import EtlMapping


@dataclass
class EtlMappingResponse:
    id: int
    username: str
    source_schema_name: str
    cdm_version: str
    scan_report_name: str
    scan_report_id: str


def to_etl_mapping_response(etl_mapping: EtlMapping):
    return EtlMappingResponse(
        id=etl_mapping.id,
        username=etl_mapping.username,
        source_schema_name=etl_mapping.source_schema_name,
        cdm_version=etl_mapping.cdm_version,
        scan_report_name=etl_mapping.scan_report_name,
        scan_report_id=etl_mapping.scan_report_id
    )
