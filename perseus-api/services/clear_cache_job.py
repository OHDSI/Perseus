from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler

from app import app
from services import cache_service
from services.model.scan_report_cache_info import ScanReportCacheInfo
from utils.file_util import delete_if_exist

job_scheduler = BackgroundScheduler(timezone='UTC')
job_id = 'clear_cache'


def create_clear_cache_job():
    job_scheduler.add_job(func=clear_cache, trigger='interval', seconds=60 * 15, id=job_id)
    job_scheduler.start()


def clear_cache():
    cache = cache_service.uploaded_scan_report_info
    for key in cache:
        cache_data: ScanReportCacheInfo = cache[key]
        current_time = datetime.now()
        delta: timedelta = current_time - cache_data.date_time
        seconds = delta.total_seconds()
        minutes = (seconds % 3600) // 60
        if minutes >= 25:
            if cache_data.book is not None:
                app.logger.info('Closing scan-report WORKBOOK...')
                cache_data.book.release_resources()
                cache_data.book = None
                app.logger.info(f"Released resources for user \'{key}\'")
            delete_if_exist(cache_data.scan_report_path)
