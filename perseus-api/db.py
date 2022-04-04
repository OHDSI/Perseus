from peewee import *
from app import app

app_logic_db = PostgresqlDatabase(app.config["APP_LOGIC_DB_NAME"], user=app.config["APP_LOGIC_DB_USER"], password=app.config["APP_LOGIC_DB_PASSWORD"],
                                   host=app.config["APP_LOGIC_DB_HOST"], port=app.config["APP_LOGIC_DB_PORT"])

user_schema_db = PostgresqlDatabase(app.config["USER_SCHEMAS_DB_NAME"], user=app.config["USER_SCHEMAS_DB_USER"], password=app.config["USER_SCHEMAS_DB_PASSWORD"],
                                    host=app.config["USER_SCHEMAS_DB_HOST"], port=app.config["USER_SCHEMAS_DB_PORT"])