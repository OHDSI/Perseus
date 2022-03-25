from waitress import serve

from app import app
from config import PORT
from db import user_schemas_db
from perseus_api import perseus
from utils import UPLOAD_SOURCE_SCHEMA_FOLDER

app.config['UPLOAD_FOLDER'] = UPLOAD_SOURCE_SCHEMA_FOLDER
app.register_blueprint(perseus)


@app.before_request
def before_request():
    if user_schemas_db.is_closed():
        user_schemas_db.connect()


@app.after_request
def after_request(response):
    if not user_schemas_db.is_closed():
        user_schemas_db.close()
    return response


if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=PORT)