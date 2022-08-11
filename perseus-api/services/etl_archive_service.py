import json
import mimetypes
import os
import shutil
import zipfile
from pathlib import Path

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app import app
from model.etl_mapping import EtlMapping
from services import cache_service
from services.files_manager_service import save_file
from services.etl_mapping_service import create_etl_mapping_by_response,\
                                         find_by_id
from services.model.etl_archive_content import EtlArchiveContent
from services.request.generate_etl_archive_request import GenerateEtlArchiveRequest
from services.response.upload_etl_archive_response import to_upload_etl_archive_response
from services.scan_reports_service import ALLOWED_SCAN_REPORT_EXTENSIONS, get_scan_report_path
from services.source_schema_service import create_source_schema_by_tables
from utils.constants import UPLOAD_ETL_FOLDER,\
                            UPLOAD_SCAN_REPORT_FOLDER,\
                            GENERATE_ETL_ARCHIVE_PATH,\
                            ETL_MAPPING_ARCHIVE_FORMAT
from utils.directory_util import get_filenames_in_directory
from utils.exceptions import InvalidUsage


def upload_etl_archive(etl_archive: FileStorage, username: str):
    etl_filename = secure_filename(etl_archive.filename)
    archive_path = Path(UPLOAD_ETL_FOLDER, username)
    archive_path.mkdir(exist_ok=True, parents=True)
    etl_path = Path(archive_path, etl_filename)

    try:
        etl_archive.save(etl_path)
        _extract_etl_archive(etl_path, archive_path)
    except Exception as e:
        shutil.rmtree(archive_path)
        raise InvalidUsage(f"Error while opening etl archive: {e.__str__()}", 400, base=e)
    finally:
        etl_archive.close()
        os.remove(etl_path)

    try:
        filenames = get_filenames_in_directory(archive_path)
        etl_archive_content = _to_etl_archive_content(filenames)

        with open(Path(archive_path, etl_archive_content.mapping_json_file_name)) as mapping_json_file:
            mapping_json = json.load(mapping_json_file)

        source_tables = mapping_json['source']
        create_source_schema_by_tables(username, source_tables)

        scan_report_directory = Path(UPLOAD_SCAN_REPORT_FOLDER, username)
        scan_report_directory.mkdir(exist_ok=True, parents=True)

        scan_report_filename = etl_archive_content.scan_report_file_name
        scan_report_file = Path(scan_report_directory, scan_report_filename)
        shutil.copy(Path(archive_path, scan_report_filename), scan_report_file)
        guess_type = mimetypes.guess_type(scan_report_file)[0]

        file_save_response = save_file(
            username,
            scan_report_filename,
            scan_report_file,
            guess_type
        )

        etl_mapping_json = mapping_json.get('etlMapping')
        if etl_mapping_json:
            cdm_version = etl_mapping_json.get('cdm_version')
        else:
            cdm_version = mapping_json.get('version') # Old mapping format


        etl_mapping = create_etl_mapping_by_response(username, cdm_version, file_save_response)
        cache_service.set_uploaded_scan_report_info(username, etl_mapping.id, str(scan_report_file))

        return to_upload_etl_archive_response(etl_mapping, mapping_json)
    finally:
        shutil.rmtree(archive_path)


def generate_etl_archive(request: GenerateEtlArchiveRequest, username: str) -> (Path, str):
    etl_mapping: EtlMapping = find_by_id(request.etl_mapping_id, username)
    scan_report_path = get_scan_report_path(etl_mapping)
    generate_archive_directory = Path(GENERATE_ETL_ARCHIVE_PATH, username, request.name)
    generate_archive_directory.mkdir(exist_ok=True, parents=True)

    try:
        shutil.copy(scan_report_path, Path(generate_archive_directory, etl_mapping.scan_report_name))
        json_mapping = json.dumps(request.etl_configuration)
        with open(Path(generate_archive_directory, f'{request.name}.json'), 'w') as json_file:
            json_file.write(json_mapping)
        shutil.make_archive(
            str(generate_archive_directory),
            ETL_MAPPING_ARCHIVE_FORMAT,
            generate_archive_directory
        )
    finally:
        shutil.rmtree(generate_archive_directory)

    return Path(GENERATE_ETL_ARCHIVE_PATH, username), f'{request.name}.zip'


def _extract_etl_archive(archive_path, directory_to_extract):
    app.logger.info("Extracting ETL archive...")
    try:
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall(directory_to_extract)
    except Exception as e:
        raise InvalidUsage(f"Can not extract ETL archive: {e.__str__()}", 500, base=e)


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
    _check_etl_archive_content(filenames)

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