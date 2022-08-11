import os

from app import app
from db import app_logic_db
from model.etl_mapping import EtlMapping
from services.request.set_cdm_version_request import SetCdmVersionRequest
from services.response.file_save_reponse import FileSaveResponse
from services.request.scan_report_request import ScanReportRequest
from utils.exceptions import InvalidUsage


def find_by_id(etl_id: int, username: str):
    try:
        etl_mapping: EtlMapping = EtlMapping.get(EtlMapping.id == etl_id)
        if etl_mapping.username != username:
            raise InvalidUsage('Cannot get access to other user ETL mapping', 403)
        return etl_mapping
    except InvalidUsage as e:
        raise e
    except Exception as e:
        raise InvalidUsage(f'ETL mapping not found by id {etl_id}', 404, base=e)


@app_logic_db.atomic()
def create_etl_mapping(username: str, cdm_version: str or None):
    app.logger.info("Creating new ETL mapping...")
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             cdm_version=cdm_version)
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def create_etl_mapping_by_request(username: str, scan_report_request: ScanReportRequest) -> EtlMapping:
    app.logger.info("Creating new ETL mapping by FM response...")
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=source_schema_name_from_req(scan_report_request),
                             cdm_version=scan_report_request.cdm_version,
                             scan_report_name=scan_report_request.file_name,
                             scan_report_id=scan_report_request.data_id)
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def create_etl_mapping_by_response(username: str,
                                   cdm_version: str or None,
                                   file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping by FM Response...")
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=source_schema_name_from_resp(file_save_response),
                             cdm_version = cdm_version,
                             scan_report_name=file_save_response.fileName,
                             scan_report_id=file_save_response.id)
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def delete_etl_mapping(etl_id: int):
    EtlMapping.delete_by_id(etl_id)


@app_logic_db.atomic()
def set_scan_report_info(etl_mapping_id: int, file_save_response: FileSaveResponse):
    try:
        etl_mapping = EtlMapping.get(EtlMapping.id == etl_mapping_id)
        etl_mapping.source_schema_name = source_schema_name_from_resp(file_save_response)
        etl_mapping.scan_report_id = file_save_response.id
        etl_mapping.scan_report_name = file_save_response.fileName
        etl_mapping.save()
        return etl_mapping
    except IndexError as e:
        raise InvalidUsage(f'ETL mapping not found by id {etl_mapping_id}', 500, base=e)


@app_logic_db.atomic()
def set_cdm_version(req: SetCdmVersionRequest, username: str) -> EtlMapping:
    try:
        etl_mapping = EtlMapping.get(EtlMapping.id == req.etl_mapping_id)
        if etl_mapping.username != username:
            raise InvalidUsage(403, 'Cannot update other user ETL mapping')
        etl_mapping.cdm_version = req.cdm_version
        etl_mapping.save()
        return etl_mapping
    except IndexError as e:
        raise InvalidUsage(f'ETL mapping not found by id {req.etl_mapping_id}', 404, base=e)


def source_schema_name_from_req(file_save_response: ScanReportRequest) -> str:
    return os.path.splitext(file_save_response.file_name)[0]


def source_schema_name_from_resp(file_save_response: FileSaveResponse) -> str:
    return os.path.splitext(file_save_response.fileName)[0]


def _is_new_configuration(json_configuration):
    return 'etlMapping' in json_configuration
