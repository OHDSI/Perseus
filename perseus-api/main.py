from waitress import serve

from app import app
from config import PORT
from create_tables import create_tables
from db import app_logic_db
from perseus_api import perseus
from services.clear_cache_job import create_clear_cache_job
from utils import UPLOAD_SCAN_REPORT_FOLDER

app.config['UPLOAD_FOLDER'] = UPLOAD_SCAN_REPORT_FOLDER
app.register_blueprint(perseus)


@app.before_request
def before_request():
    if app_logic_db.is_closed():
        app_logic_db.connect()


@app.after_request
def after_request(response):
    if not app_logic_db.is_closed():
        app_logic_db.close()
    return response


if __name__ == '__main__':
    create_tables()
    create_clear_cache_job()
    serve(app, host='0.0.0.0', port=PORT)
