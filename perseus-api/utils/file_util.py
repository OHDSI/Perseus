import os
from pathlib import Path


def delete_if_exist(path: str or Path):
    if os.path.exists(path):
        os.remove(path)


