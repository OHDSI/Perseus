from dataclasses import dataclass


@dataclass
class ScanReportRequest:
    data_id: int
    file_name: str
