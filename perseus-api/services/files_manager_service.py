import json

import requests
from werkzeug.datastructures import FileStorage

from app import app
from services.response import file_save_reponse
from utils import InvalidUsage
from utils.exceptions import NotFoundException

FILE_MANAGER_URL = app.config["FILE_MANAGER_API_URL"]


def get_file(data_id: int):
    url = f'{FILE_MANAGER_URL}/api/{data_id}'
    r = requests.get(url)
    if r.status_code == 200:
        return r.content
    else:
        if r.status_code == 404:
            raise NotFoundException(f'File not found by id {data_id}')
        else:
            raise InvalidUsage('Can download file', 500)


def save_file(username: str, data_key: str, file: FileStorage):
    url = f'{FILE_MANAGER_URL}/api'
    file.name = file.filename
    files = {'file': file}
    values = {'username': username, 'dataKey': data_key}
    r = requests.post(url=url, files=files, data=values)
    if r.status_code == 200:
        json_result = json.loads(r.content.decode('utf-8'))
        return file_save_reponse.from_json(json_result)
    else:
        raise InvalidUsage('Can not save file', 500)
