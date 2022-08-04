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
    except InvalidUsage as e:
        raise e
    except Exception as e:
        raise InvalidUsage(f'ETL mapping not found by id {idNum}', 404, base=e)


@app_logic_db.atomic()
def create_etl_mapping(username: str):
    app.logger.info("Creating new ETL mapping...")
    etl_mapping = EtlMapping(username=username, user_schema_name=username)
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def create_etl_mapping_by_request(username: str, scan_report_request: ScanReportRequest) -> EtlMapping:
    app.logger.info("Creating new ETL mapping by FM response...")
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=source_schema_name_from_req(scan_report_request),
                             scan_report_name=scan_report_request.file_name,
                             scan_report_id=scan_report_request.data_id)
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def create_etl_mapping_by_response(username: str,
                                   file_save_response: FileSaveResponse):
    app.logger.info("Creating new ETL mapping by FM Response...")
    etl_mapping = EtlMapping(username=username,
                             user_schema_name=username,
                             source_schema_name=source_schema_name_from_resp(file_save_response),
                             scan_report_name=file_save_response.fileName,
                             scan_report_id=file_save_response.id)
    etl_mapping.save()
    return etl_mapping


@app_logic_db.atomic()
def delete_etl_mapping(id: int):
    EtlMapping.delete_by_id(id)


@app_logic_db.atomic()
def set_scan_report_info(etl_mapping_id: int, file_save_response: FileSaveResponse):
    EtlMapping\
        .update(source_schema_name=source_schema_name_from_resp(file_save_response),
                scan_report_id=file_save_response.id,
                scan_report_name=file_save_response.fileName)\
        .where(EtlMapping.id == etl_mapping_id)\
        .execute()


def source_schema_name_from_req(file_save_response: ScanReportRequest) -> str:
    return os.path.splitext(file_save_response.file_name)[0]


def source_schema_name_from_resp(file_save_response: FileSaveResponse) -> str:
    return os.path.splitext(file_save_response.fileName)[0]


def _is_new_configuration(json_configuration):
    return 'etlMapping' in json_configuration