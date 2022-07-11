import os

from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from model.file_manager.file_save_reponse import FileSaveResponse
from service import files_manager_service
from util.constants import UPLOAD_SOURCE_CODES_FOLDER
from util.csv_util import csv_to_list
from util.exception import InvalidUsage


def store_and_parse_csv(file: FileStorage, delimiter: str, username: str) -> (FileSaveResponse, str):
    filename = secure_filename(file.filename)
    file_directory = f"{UPLOAD_SOURCE_CODES_FOLDER}/{username}"
    try:
        os.makedirs(file_directory)
        print(f"Directory {file_directory} created")
    except FileExistsError:
        print(f"Directory {file_directory} already exist")
    file_path = f"{file_directory}/{filename}"
    file.save(file_path)
    file.close()
    source_codes = csv_to_list(file_path, delimiter)
    if len(source_codes) == 0:
        raise InvalidUsage('CSV file does not contains data')

    file_save_response = files_manager_service.save_file(username, 'Usagi', filename, file_path, file.content_type)
    file_save_response.filePath = file_path

    return file_save_response, source_codes
