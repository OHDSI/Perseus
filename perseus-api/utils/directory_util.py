import os
from pathlib import Path


def is_directory_contains_file(directory: Path or str, file_name: str):
    return file_name in os.listdir(directory)


def get_filenames_in_directory(directory: Path):
    return next(os.walk(directory), (None, None, []))[2]


def create_directory(directory):
    try:
        os.makedirs(directory)
        print(f"Directory {directory} created")
    except FileExistsError:
        print(f"Directory {directory} already exist")
    return directory