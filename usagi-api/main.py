import os
import traceback
from apscheduler.schedulers.background import BackgroundScheduler
from waitress import serve
from app import app
from config import PORT
from create_tables import create_usagi_tables, create_and_fill_usagi_data_tables
from service.solr_core_service import create_index_if_not_exist
from usagi_api import usagi
from util.usagi_db import usagi_pg_db
from util.vocabulary_db import vocabulary_pg_db

app.register_blueprint(usagi)

import_data_scheduler = BackgroundScheduler(timezone='UTC')
job_id = 'import_data'


@app.before_request
def before_request():
    if usagi_pg_db.is_closed():
        usagi_pg_db.connect()
    if vocabulary_pg_db.is_closed():
        vocabulary_pg_db.connect()


@app.after_request
def after_request(response):
    if not usagi_pg_db.is_closed():
        usagi_pg_db.close()
    if not vocabulary_pg_db.is_closed():
        vocabulary_pg_db.close()
    return response


def import_data():
    app.logger.info("Import data job started")
    try:
        create_index_if_not_exist(app.logger)
        app.logger.info("Import data job finished")
    except Exception as e:
        app.logger.error(f"Import data failed {e}")
        traceback.print_tb(e.__traceback__)
    finally:
        import_data_scheduler.remove_job(job_id)


if __name__ == '__main__':
    create_usagi_tables()
    init_usagi_data: str = os.getenv('INIT_USAGI_DATA', "")
    if init_usagi_data.lower() in ['true', 'yes', 'y', '1', 't']:
        create_and_fill_usagi_data_tables()
    import_data_scheduler.add_job(func=import_data, trigger='interval', seconds=5, id=job_id)
    import_data_scheduler.start()
    serve(app, host='0.0.0.0', port=PORT)