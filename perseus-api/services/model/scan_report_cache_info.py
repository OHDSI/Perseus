from dataclasses import dataclass
from datetime import datetime
from xlrd import Book


@dataclass
class ScanReportCacheInfo:
    etl_mapping_id: int
    date_time: datetime
    scan_report_path: str
    book: Book or None


def create(etl_mapping_id: int, scan_report_path: str, book: Book or None = None):
    return ScanReportCacheInfo(
        etl_mapping_id=etl_mapping_id,
        date_time=datetime.now(),
        scan_report_path=scan_report_path,
        book=book
    )

