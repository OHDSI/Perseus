from peewee import PostgresqlDatabase
from app import app

user_db = PostgresqlDatabase(app.config["USER_DB_NAME"],
                             user=app.config["USER_DB_USER"],
                             password=app.config["USER_DB_PASSWORD"],
                             host=app.config["USER_DB_HOST"],
                             port=app.config["USER_DB_PORT"])
