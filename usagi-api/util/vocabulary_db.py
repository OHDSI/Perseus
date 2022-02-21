from peewee import *
from main import app

vocabulary_pg_db = PostgresqlDatabase(app.config["VOCABULARY_DB_NAME"],
                                      user=app.config["VOCABULARY_DB_USER"],
                                      password=app.config["VOCABULARY_DB_PASSWORD"],
                                      host=app.config["VOCABULARY_DB_HOST"],
                                      port=app.config["VOCABULARY_DB_PORT"])
