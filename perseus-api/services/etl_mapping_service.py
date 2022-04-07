from app import app
from model.etl_mapping import EtlMapping
from services.response.file_save_reponse import FileSaveResponse
from utils.exceptions import NotFoundException


def find_by_id(id: int):
    result = EtlMapping.select().where(id=id)
    if len(result) == 0:
        raise NotFoundException(f'ETL mapping not found by id {id}')
    return result[0]


def create_etl_mapping(username: str, file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping...")
    etl_mapping = EtlMapping(username=username,
                             schema_name=username,
                             scan_report_name=file_save_response.fileName,
                             scan_report_id=file_save_response.id)
    etl_mapping.save()
    return etl_mapping


def set_cdm_version(id: int, cdm_version: str):
    EtlMapping.update(cdm_version=cdm_version).where(id=id)