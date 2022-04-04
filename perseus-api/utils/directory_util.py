import os


def is_directory_contains_file(directory, file_name):
    return file_name in os.listdir(str(directory))
