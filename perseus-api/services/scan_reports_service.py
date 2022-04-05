import os

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from model.etl_mapping import EtlMapping
from services import files_manager_service
from utils import UPLOAD_SOURCE_SCHEMA_FOLDER, InvalidUsage
from utils.directory_util import is_directory_contains_file

ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

scan_reports_cache = {}


def get_scan_report_path(etl_mapping: EtlMapping):
    scan_report_name = secure_filename(etl_mapping.scan_report_name)
    username = etl_mapping.username
    scan_report_folder = f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{username}"
    scan_report_path = f"{scan_report_folder}/{scan_report_name}"

    if not is_directory_contains_file(scan_report_folder, scan_report_name):
        file_resource = files_manager_service.get_file(etl_mapping.scan_report_id)
        _create_user_directory(username)
        scan_report_file = open(scan_report_path, 'wb')
        scan_report_file.write(file_resource)

    return scan_report_path


def load_scan_report_to_server(scan_report_file: FileStorage, current_user: str):
    """Save White Rabbit scan report to server"""
    checked_filename = _allowed_file(scan_report_file.filename)
    if scan_report_file and checked_filename:
        filename = secure_filename(checked_filename)
        _create_user_directory(current_user)
        path = f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{current_user}/{filename}"
        # todo fix saving already existed file
        scan_report_file.save(path)
        content_type = scan_report_file.content_type
        file_save_response = files_manager_service.save_file(
            current_user,
            'scan-report',
            filename,
            path,
            content_type
        )
        scan_report_file.close()
        return file_save_response
    raise InvalidUsage("Incorrect scan report", 400)


def _allowed_file(filename: str):
    """check allowed extension of file"""
    if '.' not in filename:
        return f"{filename}.xlsx"
    else:
        if filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
            return filename
        else:
            raise InvalidUsage("Incorrect scan report extension. Only xlsx or xls are allowed", 400)


def _create_user_directory(username: str):
    try:
        os.makedirs(f"{UPLOAD_SOURCE_SCHEMA_FOLDER}/{username}")
        print(f"Directory {UPLOAD_SOURCE_SCHEMA_FOLDER}/{username} created")
    except FileExistsError:
        print(f"Directory {UPLOAD_SOURCE_SCHEMA_FOLDER}/{username} already exist")
