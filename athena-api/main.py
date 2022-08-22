import traceback
from apscheduler.schedulers.background import BackgroundScheduler
from waitress import serve
from app import app
from athena_api import athena
from config import PORT, IMPORT_DATA_TO_SOLR
from service.solr_core_service import create_index_if_not_exist

app.register_blueprint(athena)
import_data_scheduler = BackgroundScheduler(timezone='UTC')
job_id = 'import_data'


def import_data():
    try:
        create_index_if_not_exist(app.logger)
    except Exception as e:
        app.logger.error(f"Import data failed {e}")
        traceback.print_tb(e.__traceback__)
    finally:
        import_data_scheduler.remove_job(job_id)


if __name__ == '__main__':
    if IMPORT_DATA_TO_SOLR:
        import_data_scheduler.add_job(func=import_data, trigger='interval', seconds=5, id=job_id)
        import_data_scheduler.start()
    serve(app, host='0.0.0.0', port=PORT)
