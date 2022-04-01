from dataclasses import dataclass
from model.etl_mapping import EtlMapping


@dataclass
class UploadScanReportResponse:
    etl_mapping: EtlMapping
    source_tables: list


def to_upload_scan_report_response(etl_mapping: EtlMapping, saved_schema):
    return UploadScanReportResponse(etl_mapping=etl_mapping, source_tables=[s.to_json() for s in saved_schema])
