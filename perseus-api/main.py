from api.authorization_api import authorization_api
from api.perseus_api import perseus
from app import app
from config import PORT
from db import pg_db
from services.web_socket_service import socketio
from utils import UPLOAD_SOURCE_SCHEMA_FOLDER

app.config['UPLOAD_FOLDER'] = UPLOAD_SOURCE_SCHEMA_FOLDER
app.register_blueprint(perseus)
app.register_blueprint(authorization_api)


@app.before_request
def before_request():
    if pg_db.is_closed():
        pg_db.connect()


@app.after_request
def after_request(response):
    if not pg_db.is_closed():
        pg_db.close()
    return response


if __name__ == '__main__':
    socketio.run(app, port=PORT, host='0.0.0.0')