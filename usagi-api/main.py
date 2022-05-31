from waitress import serve
from apscheduler.schedulers.background import BackgroundScheduler

from app import app
from config import PORT
from create_tables import create_usagi2_tables, create_usagi_tables
from create_tables_rows import create_rows_for_tables
from service.solr_core_service import create_index_if_not_exist
from usagi_api import usagi


app.register_blueprint(usagi)

import_data_scheduler = BackgroundScheduler(timezone='UTC')
job_id = 'import_data'

def import_data():
    app.logger.info("Import data job started")
    try:
        solr_conn_string = f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}"
        create_index_if_not_exist(app.logger, solr_conn_string)
        app.logger.info("Import data job finished")
    except Exception as e:
        app.logger.error(f"Import data failed {e}")
    finally:
        import_data_scheduler.remove_job(job_id)

if __name__ == '__main__':
    create_usagi_tables()
    create_usagi2_tables()
    create_rows_for_tables()
    import_data_scheduler.add_job(func=import_data, trigger='interval', seconds=5, id=job_id)
    import_data_scheduler.start()
    serve(app, host='0.0.0.0', port=PORT)