import os

from app import app
from model.etl_mapping import EtlMapping
from services.response.file_save_reponse import FileSaveResponse
from utils.exceptions import InvalidUsage


def find_by_id(id: int):
    try:
        return EtlMapping.get(EtlMapping.id == id)
    except:
        raise InvalidUsage(f'ETL mapping not found by id {id}', 404)


def create_etl_mapping(username: str, file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping...")
    file_name, extension = os.path.splitext(file_save_response.fileName)
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=file_name,
                             scan_report_name=file_save_response.fileName,
                             scan_report_id=file_save_response.id)
    etl_mapping.save()
    return etl_mapping


def set_cdm_version(id: int, cdm_version: str):
    EtlMapping.update(cdm_version=cdm_version).where(id=id)