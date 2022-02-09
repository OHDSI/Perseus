from flask import *
import os
from flask_cors import CORS
from constants import VOCABULARY_FILTERS, ATHENA_CORE_NAME
from search_service import search_athena
import logging
from waitress import serve
from apscheduler.schedulers.background import BackgroundScheduler

from solr_core_service import create_index_if_not_exist

app = Flask(__name__)
env = os.getenv('ATHENA_ENV').capitalize()
app.config.from_object(f'config.{env}Config')
CORS(app)
SOLR_CONNECTION_STRING = f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{ATHENA_CORE_NAME}"
APP_PREFIX = app.config["APP_PREFIX"]
VERSION = app.config["VERSION"]
athena = Blueprint('athena', __name__, url_prefix=APP_PREFIX)


@athena.route('/api', methods=['GET'])
def search_concepts():
    """save source schema to server side"""
    app.logger.info("REST request to GET vocabulary")
    query = request.args.get('query')
    page_size = request.args.get('pageSize')
    page = request.args.get('page')
    sort = request.args.get('sort')
    order = request.args.get('order')
    filters = {}
    for key in VOCABULARY_FILTERS:
        filters[key] = request.args.get(VOCABULARY_FILTERS[key])
    update_filters = request.args.get('updateFilters')
    search_result = search_athena(SOLR_CONNECTION_STRING, page_size, page, query, sort, order, filters, update_filters)
    return jsonify(search_result)


@athena.route('/api/info', methods=['GET'])
def app_version():
    app.logger.info("REST request to GET app info")
    return jsonify({'name': 'Athena', 'version': VERSION})


app.register_blueprint(athena)
logger = logging.getLogger('waitress')
logger.setLevel(logging.INFO)
app.logger = logger
import_data_scheduler = BackgroundScheduler(timezone='UTC')
job_id = 'import_data'


def import_data():
    logger.info("Import data job started")
    solr_conn_string = f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}"
    try:
        create_index_if_not_exist(app.logger, solr_conn_string)
        import_data_scheduler.remove_job(job_id)
        logger.info("Import data job finished")
    except Exception as e:
        import_data_scheduler.remove_job(job_id)
        logger.error(f"Import data failed {e}")


if __name__ == '__main__':
    import_data_scheduler.add_job(func=import_data, trigger='interval', seconds=5, id=job_id)
    import_data_scheduler.start()
    serve(app, host='0.0.0.0', port=app.config['PORT'])