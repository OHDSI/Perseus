import json
import mimetypes
import os
import shutil
import zipfile

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app import app
from services import source_schema_service, files_manager_service, etl_mapping_service
from services.model.etl_archive_content import EtlArchiveContent
from services.response.upload_etl_archive_response import to_upload_etl_archive_response
from services.scan_reports_service import ALLOWED_SCAN_REPORT_EXTENSIONS
from utils import file_util
from utils.constants import UPLOAD_ETL_FOLDER, UPLOAD_SCAN_REPORT_FOLDER, SCAN_REPORT_DATA_KEY
from utils.directory_util import get_filenames_in_directory
from utils.exceptions import InvalidUsage


def upload_etl_archive(etl_archive: FileStorage, username: str):
    etl_filename = secure_filename(etl_archive.filename)
    archive_directory: str = _create_upload_etl_user_directory(username)

    try:
        etl_file_path = f"{archive_directory}/{etl_filename}"
        # todo fix saving already existed file
        etl_archive.save(etl_file_path)
        try:
            _extract_etl_archive(etl_file_path, archive_directory)
        except Exception as e:
            raise InvalidUsage(e.__str__(), 400)
        etl_archive.close()
        os.remove(etl_file_path)
        filenames = get_filenames_in_directory(archive_directory)
        _check_etl_archive_content(filenames, archive_directory)
        etl_archive_content = _to_etl_archive_content(filenames)

        scan_report_path = f'{UPLOAD_SCAN_REPORT_FOLDER}/{username}/{etl_archive_content.scan_report_file_name}'
        shutil.copy(f'{archive_directory}/{etl_archive_content.scan_report_file_name}',
                    scan_report_path)
        guess_type = mimetypes.guess_type(scan_report_path)
        file_save_response = files_manager_service.save_file(
            username,
            SCAN_REPORT_DATA_KEY,
            etl_archive_content.scan_report_file_name,
            scan_report_path,
            guess_type[0]
        )

        mapping_json_file = file_util.open_file(archive_directory, etl_archive_content.mapping_json_file_name)
        mapping_json = json.load(mapping_json_file)
        mapping_json_file.close()
        source_tables = mapping_json['source']
        source_schema_service.create_source_schema_by_tables(username, source_tables)

        etl_mapping = etl_mapping_service.create_etl_mapping(username, file_save_response)

        return to_upload_etl_archive_response(etl_mapping, mapping_json)
    except Exception as e:
        etl_archive.close()
        raise e
    finally:
        shutil.rmtree(archive_directory)


def _create_upload_etl_user_directory(username: str) -> str:
    directory_path = f"{UPLOAD_ETL_FOLDER}/{username}"
    try:
        os.makedirs(directory_path)
        print(f"Directory {UPLOAD_ETL_FOLDER}/{username} created")
    except FileExistsError:
        print(f"Directory {UPLOAD_ETL_FOLDER}/{username} already exist")
    return directory_path


def _extract_etl_archive(archive_path, directory_to_extract):
    app.logger.info("Extracting ETL archive...")
    try:
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall(directory_to_extract)
    except Exception as e:
        print("Can not open ETL archive")
        raise e


def _check_etl_archive_content(filenames: list, directory):
    files_count = len(filenames)
    if files_count != 2:
        _raise_unexpected_content_of_etl_archive()

    scan_report_files = [name for name in filenames if _is_scan_report_file(name)]
    if len(scan_report_files) != 1:
        _raise_unexpected_content_of_etl_archive()

    mapping_json_files = [name for name in filenames if name.endswith('.json')]
    if len(mapping_json_files) != 1:
        _raise_unexpected_content_of_etl_archive()


def _is_scan_report_file(filename: str) -> bool:
    extensions = [ext for ext in ALLOWED_SCAN_REPORT_EXTENSIONS if filename.endswith(f'.{ext}')]
    return len(extensions) != 0


def _raise_unexpected_content_of_etl_archive():
    raise InvalidUsage("Unexpected content of ETL archive! Require two files: scan-report and mapping json.")


def _to_etl_archive_content(filenames: list) -> EtlArchiveContent:
    if _is_scan_report_file(filenames[0]):
        return EtlArchiveContent(scan_report_file_name=filenames[0],
                                 mapping_json_file_name=filenames[1])
    else:
        return EtlArchiveContent(scan_report_file_name=filenames[1],
                                 mapping_json_file_name=filenames[0])
