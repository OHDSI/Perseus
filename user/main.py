from app import app
from waitress import serve
from authorization_api import user_api
from config import PORT
from create_tables import create_tables, create_test_users

app.register_blueprint(user_api)


if __name__ == '__main__':
    create_tables()
    create_test_users()
    serve(app, host='0.0.0.0', port=PORT)