from waitress import serve

from app import app
from config import PORT
from db import user_schema_db
from perseus_api import perseus
from utils import UPLOAD_SCAN_REPORT_FOLDER


app.config['UPLOAD_FOLDER'] = UPLOAD_SCAN_REPORT_FOLDER
app.register_blueprint(perseus)


@app.before_request
def before_request():
    if user_schema_db.is_closed():
        user_schema_db.connect()


@app.after_request
def after_request(response):
    if not user_schema_db.is_closed():
        user_schema_db.close()
    return response


if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=PORT)
