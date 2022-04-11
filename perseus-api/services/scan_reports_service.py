import os

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app import app
from model.etl_mapping import EtlMapping
from services import files_manager_service
from utils import UPLOAD_SCAN_REPORT_FOLDER, InvalidUsage
from utils.constants import SCAN_REPORT_DATA_KEY
from services.request.scan_report_request import ScanReportRequest
from utils.directory_util import is_directory_contains_file

ALLOWED_SCAN_REPORT_EXTENSIONS = {'xlsx', 'xls'}

scan_reports_cache = {}


def get_scan_report_path(etl_mapping: EtlMapping):
    scan_report_name = secure_filename(etl_mapping.scan_report_name)
    username = etl_mapping.username
    scan_report_directory = f"{UPLOAD_SCAN_REPORT_FOLDER}/{username}"

    if not is_directory_contains_file(scan_report_directory, scan_report_name):
        file_resource = files_manager_service.get_file(etl_mapping.scan_report_id)
        scan_report_directory = _create_upload_scan_report_user_directory(username)
        scan_report_path = f"{scan_report_directory}/{scan_report_name}"
        scan_report_file = open(scan_report_path, 'wb')
        scan_report_file.write(file_resource)
        return scan_report_path
    else:
        return f"{scan_report_directory}/{scan_report_name}"


def load_scan_report_to_server(scan_report_file: FileStorage, username: str):
    app.logger.info("Loading WR scan report to server...")
    checked_filename = _allowed_file(scan_report_file.filename)
    if scan_report_file and checked_filename:
        filename = secure_filename(checked_filename)
        _create_upload_scan_report_user_directory(username)
        path = f"{UPLOAD_SCAN_REPORT_FOLDER}/{username}/{filename}"
        # todo fix saving already existed file
        scan_report_file.save(path)
        content_type = scan_report_file.content_type
        scan_report_file.close()
        return files_manager_service.save_file(
            username,
            SCAN_REPORT_DATA_KEY,
            filename,
            path,
            content_type
        )
    raise InvalidUsage("Incorrect scan report", 400)


def load_scan_report_from_file_manager(scan_report_request: ScanReportRequest, current_user: str):
    checked_filename = _allowed_file(scan_report_request.file_name)
    scan_report_file = files_manager_service.get_file(scan_report_request.data_id)
    if checked_filename:
        filename = secure_filename(checked_filename)
        _create_upload_scan_report_user_directory(current_user)
        path = f"{UPLOAD_SCAN_REPORT_FOLDER}/{current_user}/{filename}"
        with open(path, 'wb') as out: ## Open temporary file as bytes
            out.write(scan_report_file) 


def _allowed_file(filename: str):
    """check allowed extension of file"""
    if '.' not in filename:
        return f"{filename}.xlsx"
    else:
        if filename.rsplit('.', 1)[1].lower() in ALLOWED_SCAN_REPORT_EXTENSIONS:
            return filename
        else:
            raise InvalidUsage("Incorrect scan report extension. Only xlsx or xls are allowed", 400)


def _create_upload_scan_report_user_directory(username: str):
    directory_path = f"{UPLOAD_SCAN_REPORT_FOLDER}/{username}"
    try:
        os.makedirs(directory_path)
        print(f"Directory {directory_path} created")
    except FileExistsError:
        print(f"Directory {directory_path} already exist")
    return directory_path
