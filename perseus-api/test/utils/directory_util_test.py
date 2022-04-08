import unittest
from pathlib import Path

from utils import directory_util


class DirectoryUtilTest(unittest.TestCase):
    def test_get_filenames_in_directory(self):
        directory = Path('../resource')
        filenames_in_directory = directory_util.get_filenames_in_directory(directory)
        print(filenames_in_directory)
        self.assertTrue(len(filenames_in_directory))


if __name__ == '__main__':
    unittest.main()