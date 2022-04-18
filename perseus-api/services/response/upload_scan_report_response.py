from dataclasses import dataclass
from model.etl_mapping import EtlMapping
from services.response.etl_mapping_response import EtlMappingResponse, to_etl_mapping_response


@dataclass
class UploadScanReportResponse:
    etl_mapping: EtlMappingResponse
    source_tables: list


def to_upload_scan_report_response(etl_mapping: EtlMapping, saved_schema):
    return UploadScanReportResponse(
                                   etl_mapping=to_etl_mapping_response(etl_mapping),
                                   source_tables=[s.to_json() for s in saved_schema]
                                   )
