from authorization_api import user_api
from app import app
from config import PORT
from db import pg_db
from waitress import serve

app.register_blueprint(user_api)


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
    serve(app, host='0.0.0.0', port=PORT)