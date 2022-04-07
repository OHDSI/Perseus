import os


def is_directory_contains_file(directory, file_name):
    return file_name in os.listdir(str(directory))


def get_filenames_in_directory(directory):
    return next(os.walk(directory), (None, None, []))[2]