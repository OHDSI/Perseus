from sqlalchemy import create_engine

from app import app


vocabulary_engine = create_engine(
    f'postgresql://{app.config["VOCABULARY_DB_USER"]}:{app.config["VOCABULARY_DB_PASSWORD"]}@{app.config["VOCABULARY_DB_HOST"]}:{app.config["VOCABULARY_DB_PORT"]}/{app.config["VOCABULARY_DB_NAME"]}'
)

usagi_engine = create_engine(
    f'postgresql://{app.config["USAGI_DB_USER"]}:{app.config["USAGI_DB_PASSWORD"]}@{app.config["USAGI_DB_HOST"]}:{app.config["USAGI_DB_PORT"]}/{app.config["USAGI_DB_NAME"]}'
)