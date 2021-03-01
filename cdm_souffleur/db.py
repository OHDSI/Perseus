from peewee import *
from cdm_souffleur import app

pg_db = PostgresqlDatabase(app.config["DB_NAME"], user=app.config["DB_USER"], password=app.config["DB_PASSWORD"],
                                   host=app.config["DB_HOST"], port=app.config["DB_PORT"])