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


def create_etl_mapping_by_file_save_resp(username: str, file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping...")
    file_name, extension = os.path.splitext(file_save_response.fileName)
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=file_name,
                             scan_report_name=file_save_response.fileName,
                             scan_report_id=file_save_response.id)
    etl_mapping.save()
    return etl_mapping


def create_etl_mapping_by_json_configuration(username: str, json_configuration: dict, file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping...")
    file_name, extension = os.path.splitext(file_save_response.fileName)
    cdm_version = json_configuration['etlMapping']['cdm_version'] \
        if _is_new_configuration(json_configuration) \
        else json_configuration['version']
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=file_name,
                             cdm_version=cdm_version,
                             scan_report_name=file_save_response.fileName,
                             scan_report_id=file_save_response.id)
    etl_mapping.save()
    return etl_mapping


def set_cdm_version(id: int, cdm_version: str):
    EtlMapping.update(cdm_version=cdm_version).where(id=id)


def _is_new_configuration(json_configuration):
    return 'etlMapping' in json_configuration