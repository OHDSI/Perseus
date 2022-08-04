from pathlib import Path
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from app import app
from services import files_manager_service, cache_service
from services.response.file_save_reponse import FileSaveResponse
from utils import UPLOAD_SCAN_REPORT_FOLDER, InvalidUsage
from model.etl_mapping import EtlMapping
from services.request.scan_report_request import ScanReportRequest
from utils.directory_util import is_directory_contains_file

ALLOWED_SCAN_REPORT_EXTENSIONS = {'xlsx', 'xls'}


def get_scan_report_path(etl_mapping: EtlMapping) -> Path:
    scan_report_name = secure_filename(etl_mapping.scan_report_name)
    username = etl_mapping.username
    scan_report_directory = Path(UPLOAD_SCAN_REPORT_FOLDER, username)

    if cache_service.get_etl_mapping_id(username) != etl_mapping.id or \
            not is_directory_contains_file(scan_report_directory, scan_report_name):
        scan_report_path = load_scan_report_and_get_path(etl_mapping)
        cache_service.set_uploaded_scan_report_info(username, etl_mapping.id, str(scan_report_path))
        return scan_report_path
    elif not is_directory_contains_file(scan_report_directory, scan_report_name):
        return load_scan_report_and_get_path(etl_mapping)
    else:
        return Path(scan_report_directory, scan_report_name)


def load_scan_report_and_get_path(etl_mapping: EtlMapping) -> Path:
    username = etl_mapping.username
    scan_report_name = secure_filename(etl_mapping.scan_report_name)
    file_resource = files_manager_service.get_file(etl_mapping.scan_report_id)
    scan_report_directory = _create_upload_scan_report_user_directory(username)
    scan_report_path = Path(scan_report_directory, scan_report_name)
    with open(scan_report_path, 'wb') as file:
        file.write(file_resource)

    return scan_report_path


def store_scan_report(scan_report_file: FileStorage, username: str) -> (str, str):
    app.logger.info("Storing scan report...")
    checked_filename = _allowed_file(scan_report_file.filename)
    if scan_report_file and checked_filename:
        filename = secure_filename(checked_filename)
        _create_upload_scan_report_user_directory(username)
        scan_report_path = Path(UPLOAD_SCAN_REPORT_FOLDER, username, filename)
        scan_report_file.save(scan_report_path)
        content_type = scan_report_file.content_type
        scan_report_file.close()
        return filename, content_type
    raise InvalidUsage("Incorrect scan report", 400)


def load_scan_report_to_file_manager(filename: str, content_type: str, username: str) -> FileSaveResponse:
    scan_report_path = Path(UPLOAD_SCAN_REPORT_FOLDER, username, filename)
    return files_manager_service.save_file(
        username,
        filename,
        scan_report_path,
        content_type
    )


def load_scan_report_from_file_manager(scan_report_request: ScanReportRequest, username: str):
    checked_filename = _allowed_file(scan_report_request.file_name)
    scan_report_file = files_manager_service.get_file(scan_report_request.data_id)
    if checked_filename:
        filename = secure_filename(checked_filename)
        _create_upload_scan_report_user_directory(username)
        path = Path(UPLOAD_SCAN_REPORT_FOLDER, username, filename)
        with open(path, 'wb') as out:
            out.write(scan_report_file)
        return path


def _allowed_file(filename: str):
    """check allowed extension of file"""
    if '.' not in filename:
        raise InvalidUsage("Scan report file without extension. Extension must be xlsx or xls", 400)
    else:
        if filename.rsplit('.', 1)[1].lower() in ALLOWED_SCAN_REPORT_EXTENSIONS:
            return filename
        else:
            raise InvalidUsage("Incorrect scan report extension. Only xlsx or xls are allowed", 400)


def _create_upload_scan_report_user_directory(username: str):
    directory_path = Path(UPLOAD_SCAN_REPORT_FOLDER, username)
    if not directory_path.is_dir():
        directory_path.mkdir(exist_ok=True, parents=True)
    return directory_path
