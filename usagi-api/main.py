from app import app
from config import PORT
from usagi_api import usagi
from util.usagi_db import usagi_pg_db
from util.user_db import user_db
from util.vocabulary_db import vocabulary_pg_db
from service.web_socket_service import socket

app.register_blueprint(usagi)


@app.before_request
def before_request():
    if usagi_pg_db.is_closed():
        usagi_pg_db.connect()

    if user_db.is_closed():
        user_db.connect()

    if vocabulary_pg_db.is_closed():
        vocabulary_pg_db.connect()


@app.after_request
def after_request(response):
    if not usagi_pg_db.is_closed():
        usagi_pg_db.close()

    if user_db.is_closed():
        user_db.connect()

    if vocabulary_pg_db.is_closed():
        vocabulary_pg_db.connect()

    return response


if __name__ == '__main__':
    socket.run(app, port=PORT, host='0.0.0.0')