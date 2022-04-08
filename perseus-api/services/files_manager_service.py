import json

import requests

from app import app
from services.response import file_save_reponse
from utils import InvalidUsage

FILE_MANAGER_URL = app.config["FILE_MANAGER_API_URL"]


def get_file(data_id: int):
    url = f'{FILE_MANAGER_URL}/api/{data_id}'
    r = requests.get(url)
    if r.status_code == 200:
        return r.content
    else:
        if r.status_code == 404:
            raise InvalidUsage(f'File not found by id {data_id}', 404)
        else:
            raise InvalidUsage('Can download file', 500)


def save_file(username: str,
              data_key: str,
              filename: str,
              file_path: str,
              content_type: str):
    url = f'{FILE_MANAGER_URL}/api'
    files = {'file': (filename, open(file_path, 'rb'), content_type)}
    values = {'username': username, 'dataKey': data_key}
    r = requests.post(url=url, files=files, data=values, verify=False)
    if r.status_code == 200:
        json_result = json.loads(r.content.decode('utf-8'))
        return file_save_reponse.from_json(json_result)
    else:
        raise InvalidUsage('Can not save file', 500)
