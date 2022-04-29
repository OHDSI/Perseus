from xlrd import Book
from services.model import scan_report_cache_info
from services.model.scan_report_cache_info import ScanReportCacheInfo
from utils.file_util import delete_if_exist


# {[username: str]: ScanReportCacheInfo}
uploaded_scan_report_info = {}


def get_etl_mapping_id(username: str) -> int or None:
    if username in uploaded_scan_report_info:
        cache_data = uploaded_scan_report_info[username]
        return cache_data.etl_mapping_id
    else:
        return None


def get_scan_report_info(username: str) -> ScanReportCacheInfo or None:
    if username in uploaded_scan_report_info:
        return uploaded_scan_report_info[username]
    else:
        return None


def set_uploaded_scan_report_info(username: str, etl_mapping_id: int, scan_report_path: str, book: Book or None = None):
    if username in uploaded_scan_report_info:
        cache_data = uploaded_scan_report_info[username]
        if cache_data.book is not None:
            cache_data.book.release_resources()
            cache_data.book = None
        if cache_data.scan_report_path != scan_report_path:
            delete_if_exist(cache_data.scan_report_path)

    new_data = scan_report_cache_info.create(etl_mapping_id, scan_report_path, book)
    uploaded_scan_report_info[username] = new_data


def release_resource_if_used(username: str):
    if username in uploaded_scan_report_info:
        cache_data = uploaded_scan_report_info[username]
        if cache_data.book is not None:
            cache_data.book.release_resources()
            cache_data.book = None