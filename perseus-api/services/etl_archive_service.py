import json
import mimetypes
import os
import shutil
import zipfile

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app import app
from model.etl_mapping import EtlMapping
from services.files_manager_service import save_file
from services.etl_mapping_service import create_etl_mapping_by_json_configuration,\
                                         find_by_id
from services.model.etl_archive_content import EtlArchiveContent
from services.request.generate_etl_archive_request import GenerateEtlArchiveRequest
from services.response.upload_etl_archive_response import to_upload_etl_archive_response
from services.scan_reports_service import ALLOWED_SCAN_REPORT_EXTENSIONS, get_scan_report_path
from services.source_schema_service import create_source_schema_by_tables
from utils import file_util
from utils.constants import UPLOAD_ETL_FOLDER,\
                            UPLOAD_SCAN_REPORT_FOLDER,\
                            SCAN_REPORT_DATA_KEY,\
                            GENERATE_ETL_ARCHIVE_PATH,\
                            ETL_MAPPING_ARCHIVE_FORMAT
from utils.directory_util import get_filenames_in_directory, create_directory
from utils.exceptions import InvalidUsage


def upload_etl_archive(etl_archive: FileStorage, username: str):
    etl_filename = secure_filename(etl_archive.filename)
    archive_directory = create_directory(f"{UPLOAD_ETL_FOLDER}/{username}")

    try:
        etl_file_path = f"{archive_directory}/{etl_filename}"
        # todo fix saving already existed file
        etl_archive.save(etl_file_path)
        _extract_etl_archive(etl_file_path, archive_directory)
        etl_archive.close()
    except Exception as e:
        raise InvalidUsage(f"Error while opening etl archive: {e.__str__()}", 400)
    try:
        os.remove(etl_file_path)
        filenames = get_filenames_in_directory(archive_directory)
        _check_etl_archive_content(filenames)
        etl_archive_content = _to_etl_archive_content(filenames)

        scan_report_directory = create_directory(f"{UPLOAD_SCAN_REPORT_FOLDER}/{username}")
        scan_report_path = f'{scan_report_directory}/{etl_archive_content.scan_report_file_name}'
        shutil.copy(f'{archive_directory}/{etl_archive_content.scan_report_file_name}',
                    scan_report_path)
        guess_type = mimetypes.guess_type(scan_report_path)
        file_save_response = save_file(
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
        create_source_schema_by_tables(username, source_tables)

        etl_mapping = create_etl_mapping_by_json_configuration(username, mapping_json, file_save_response)

        return to_upload_etl_archive_response(etl_mapping, mapping_json)
    except Exception as e:
        etl_archive.close()
        raise InvalidUsage(f"Could not create etl mapping with etl archive: {e.__str__()}", 500)
    finally:
        shutil.rmtree(archive_directory)


def generate_etl_archive(request: GenerateEtlArchiveRequest, username: str):
    etl_mapping: EtlMapping = find_by_id(request.etl_mapping_id)
    if etl_mapping.username != username:
        raise InvalidUsage("Forbidden to save other user ETL mapping", 403)

    scan_report_path = get_scan_report_path(etl_mapping)
    generate_archive_directory = create_directory(f'{GENERATE_ETL_ARCHIVE_PATH}/{username}/{request.name}')
    shutil.copy(scan_report_path, f'{generate_archive_directory}/{etl_mapping.scan_report_name}')

    json_mapping = json.dumps(request.etl_configuration)
    json_file = open(f'{generate_archive_directory}/{request.name}.json', 'w')
    json_file.write(json_mapping)
    json_file.close()

    shutil.make_archive(
        generate_archive_directory,
        ETL_MAPPING_ARCHIVE_FORMAT,
        generate_archive_directory
    )
    shutil.rmtree(generate_archive_directory)

    return f'{GENERATE_ETL_ARCHIVE_PATH}/{username}', f'{request.name}.zip'


def _extract_etl_archive(archive_path, directory_to_extract):
    app.logger.info("Extracting ETL archive...")
    try:
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall(directory_to_extract)
    except Exception as e:
        raise InvalidUsage(f"Can not extract ETL archive: {e.__str__()}", 500)


def _check_etl_archive_content(filenames: list):
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
        return EtlArchiveContent(
                                scan_report_file_name=filenames[0],
                                mapping_json_file_name=filenames[1]
                                )
    else:
        return EtlArchiveContent(
                                scan_report_file_name=filenames[1],
                                mapping_json_file_name=filenames[0]
                                )