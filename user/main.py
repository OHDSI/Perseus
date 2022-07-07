from app import app
from waitress import serve
from authorization_api import user_api
from config import PORT
from create_tables import create_tables, create_test_users
from db import pg_db

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
    create_tables()
    create_test_users()
    serve(app, host='0.0.0.0', port=PORT)