import os

from app import app
from db import app_logic_db
from model.etl_mapping import EtlMapping
from services.response.file_save_reponse import FileSaveResponse
from services.request.scan_report_request import ScanReportRequest
from utils.exceptions import InvalidUsage


def find_by_id(idNum: int, username: str):
    try:
        etl_mapping: EtlMapping = EtlMapping.get(EtlMapping.id == idNum)
        if etl_mapping.username != username:
            raise InvalidUsage('Cannot get access to other user ETL mapping', 403)
        return etl_mapping
    except:
        raise InvalidUsage(f'ETL mapping not found by id {idNum}', 404)


@app_logic_db.atomic()
def create_etl_mapping_by_file_save_resp(username: str, file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping by file-save response...")
    file_name = os.path.splitext(file_save_response.fileName)[0]
    etl_mapping = EtlMapping(
                            username=username,
                            user_schema_name=username,
                            source_schema_name=file_name,
                            scan_report_name=file_save_response.fileName,
                            scan_report_id=file_save_response.id
                            )
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def create_etl_mapping_from_request(username: str, scan_report_request: ScanReportRequest) -> EtlMapping:
    app.logger.info("Creating new ETL mapping from scan report request...")
    file_name = os.path.splitext(scan_report_request.file_name)[0]
    etl_mapping = EtlMapping(
                            username=username,
                            user_schema_name=username,
                            source_schema_name=file_name,
                            scan_report_name=scan_report_request.file_name,
                            scan_report_id=scan_report_request.data_id
                            )
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def create_etl_mapping_by_json_configuration(
                                            username: str,\
                                            json_configuration: dict,\
                                            file_save_response: FileSaveResponse
                                            ):
    app.logger.info("Creating new ETL mapping by json configuration...")
    file_name = os.path.splitext(file_save_response.fileName)[0]
    cdm_version = json_configuration['etlMapping']['cdm_version'] \
        if _is_new_configuration(json_configuration) \
        else json_configuration['version']
    etl_mapping = EtlMapping(
                            username=username,
                            user_schema_name=username,
                            source_schema_name=file_name,
                            cdm_version=cdm_version,
                            scan_report_name=file_save_response.fileName,
                            scan_report_id=file_save_response.id
                            )
    etl_mapping.save()
    return etl_mapping


def set_cdm_version(idNum: int, cdm_version: str):
    EtlMapping.update(cdm_version=cdm_version).where(id=idNum)


def _is_new_configuration(json_configuration):
    return 'etlMapping' in json_configuration