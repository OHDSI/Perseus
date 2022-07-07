import os
from pathlib import Path
from typing import TextIO
from utils import InvalidUsage


def open_file(path: str or Path) -> TextIO:
    try:
        return open(path, 'r')
    except Exception as e:
        raise InvalidUsage(f"Can not open {path} file: {e.__str__()}", 500, base=e)


def copy_file(from_path: str, to_path: str):
    try:
        with open(from_path, 'r') as fp:
            fp.save
    except Exception as e:
        raise InvalidUsage(f"Can not open {from_path} file: {e.__str__()}", 500, base=e)


def delete_if_exist(path: str or Path):
    if os.path.exists(path):
        os.remove(path)


