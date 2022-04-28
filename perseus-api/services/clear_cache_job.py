from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler

from app import app
from services import cache_service
from services.model.scan_report_cache_info import ScanReportCacheInfo
from utils.file_util import delete_if_exist

job_scheduler = BackgroundScheduler(timezone='UTC')
job_id = 'clear_cache'


def create_clear_cache_job():
    job_scheduler.add_job(func=clear_cache, trigger='interval', seconds=60 * 31, id=job_id)
    job_scheduler.start()
    print("Created clear cache job")


def clear_cache():
    app.logger.info("Clear cache job started")
    cache = cache_service.uploaded_scan_report_info
    for key in cache:
        cache_data: ScanReportCacheInfo = cache[key]
        current_time = datetime.now()
        delta: timedelta = current_time - cache_data.date_time
        seconds = delta.total_seconds()
        minutes = (seconds % 3600) // 60
        if minutes >= 29:
            if cache_data.book is not None:
                cache_data.book.release_resources()
                cache_data.book = None
                app.logger.info(f"Released resources from user \'{key}\'")
            delete_if_exist(cache_data.scan_report_path)
    app.logger.info("Clear cache job finished")
