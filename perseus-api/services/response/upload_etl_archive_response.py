from dataclasses import dataclass
from typing import Any

from model.etl_mapping import EtlMapping
from services.response.etl_mapping_response import EtlMappingResponse, to_etl_mapping_response


@dataclass
class UploadEtlArchiveResponse:
    etl_mapping: EtlMappingResponse
    etl_configuration: Any


def to_upload_etl_archive_response(etl_mapping: EtlMapping, etl_configuration):
    return UploadEtlArchiveResponse(
                                   etl_mapping = to_etl_mapping_response(etl_mapping),
                                   etl_configuration=etl_configuration
                                   )
