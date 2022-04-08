from dataclasses import dataclass


@dataclass
class EtlArchiveContent:
    scan_report_file_name: str
    mapping_json_file_name: str