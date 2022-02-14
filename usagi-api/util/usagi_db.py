from peewee import *

from main import app

usagi_pg_db = PostgresqlDatabase(app.config["USAGI_DB_NAME"],
                                 user=app.config["USAGI_DB_USER"],
                                 password=app.config["USAGI_DB_PASSWORD"],
                                 host=app.config["USAGI_DB_HOST"],
                                 port=app.config["USAGI_DB_PORT"])
