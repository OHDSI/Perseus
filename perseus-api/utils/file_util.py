from typing import TextIO

from utils import InvalidUsage


def open_file(directory: str, filename: str) -> TextIO:
    path = f'{directory}/{filename}'
    try:
        return open(path, 'r')
    except Exception as e:
        raise InvalidUsage(f"Can not open {filename} file: {e}", 500)


def copy_file(from_path: str, to_path: str):
    try:
        with open(from_path, 'r') as fp:
            fp.save
    except Exception as e:
        raise InvalidUsage(f"Can not open {from_path} file: {e}", 500)