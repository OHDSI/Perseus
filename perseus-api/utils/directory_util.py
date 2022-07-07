import os


def is_directory_contains_file(directory, file_name):
    return file_name in os.listdir(str(directory))


def get_filenames_in_directory(directory):
    return next(os.walk(directory), (None, None, []))[2]


def create_directory(directory):
    try:
        os.makedirs(directory)
        print(f"Directory {directory} created")
    except FileExistsError:
        print(f"Directory {directory} already exist")
    return directory