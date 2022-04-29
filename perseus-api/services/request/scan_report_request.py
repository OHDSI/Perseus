from dataclasses import dataclass


@dataclass
class ScanReportRequest:
    data_id: int
    file_name: str


def from_json(json: dict):
    return ScanReportRequest(
                            data_id=json['dataId'],
                            file_name=json['fileName']
                            )