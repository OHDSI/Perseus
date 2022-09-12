import json
from pathlib import Path
import requests
from app import app
from services.response.file_save_reponse import FileSaveResponse
from utils import InvalidUsage
from services.response import file_save_reponse
from utils.constants import SCAN_REPORT_DATA_KEY

FILE_MANAGER_URL = app.config["FILE_MANAGER_API_URL"]


def get_file(data_id: int) -> bytes:
    app.logger.info('INTERNAL request to get file via File Manager')
    url = f'{FILE_MANAGER_URL}/api/{data_id}'
    r = requests.get(url)
    if r.status_code == 200:
        return r.content
    else:
        if r.status_code == 404:
            raise InvalidUsage(f'File not found by id {data_id}', 404)
        else:
            raise InvalidUsage(f'Cannot download file. File manager response status code: {r.status_code}', 500)


def save_file(username: str,
              filename: str,
              file_path: Path,
              content_type: str) -> FileSaveResponse:
    app.logger.info('INTERNAL request to save file via File Manager')
    url = f'{FILE_MANAGER_URL}/api'
    with open(file_path, 'rb') as file:
        files = {'file': (filename, file, content_type)}
        values = {'username': username, 'dataKey': SCAN_REPORT_DATA_KEY}
        r = requests.post(url=url, files=files, data=values, verify=False)
        if r.status_code == 200:
            json_result = json.loads(r.content.decode('utf-8'))
            return file_save_reponse.from_json(json_result)
        else:
            raise InvalidUsage(f'Can not save file. File manager response status code: {r.status_code}', 500)
