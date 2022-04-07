import unittest

from services.files_manager_service import get_file
from utils.exceptions import NotFoundException


class FilesManagerTest(unittest.TestCase):
    def test_get_file(self):
        data_id = 1
        file_resource = get_file(data_id)
        self.assertIsNotNone(file_resource)

    def test_not_found(self):
        data_id = 0
        with self.assertRaises(NotFoundException):
            get_file(data_id)


if __name__ == '__main__':
    unittest.main()
