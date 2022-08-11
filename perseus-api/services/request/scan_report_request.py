from dataclasses import dataclass


@dataclass
class ScanReportRequest:
    data_id: int
    file_name: str
    cdm_version: str or None


def from_json(json: dict):
    return ScanReportRequest(
        data_id=json['dataId'],
        file_name=json['fileName'],
        cdm_version=json.get('cdmVersion')
    )
