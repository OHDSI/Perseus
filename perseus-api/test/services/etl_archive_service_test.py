import unittest
from pathlib import Path

from services import etl_archive_service


class EtlArchiveServiceTest(unittest.TestCase):
    def test_extract_etl_archive(self):
        to_extract = Path('../resource/to_extract')
        try:
            etl_archive_service._extract_etl_archive('../resource/test.etl', to_extract)
        except Exception as e:
            self.fail(f"Unexpected exception: {e}")

    def test_check_etl_archive_content(self):
        to_extract = Path('../resource/to_extract')
        etl_archive_service._extract_etl_archive('../resource/test.etl', to_extract)
        filenames = etl_archive_service.get_filenames_in_directory(to_extract)
        try:
            etl_archive_service._check_etl_archive_content(filenames)
        except Exception as e:
            self.fail(f"Unexpected exception: {e}")


if __name__ == '__main__':
    unittest.main()
