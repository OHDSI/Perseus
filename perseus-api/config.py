import os

PORT = 5000
APP_PREFIX = '/backend'
VERSION = 0.4


class LocalConfig:
    APP_LOGIC_DB_NAME = 'shared'
    APP_LOGIC_DB_USER = 'perseus'
    APP_LOGIC_DB_PASSWORD = 'password'
    APP_LOGIC_DB_HOST = 'localhost'
    APP_LOGIC_DB_PORT = 5432

    USER_SCHEMAS_DB_NAME = 'source'
    USER_SCHEMAS_DB_USER = 'source'
    USER_SCHEMAS_DB_PASSWORD = 'password'
    USER_SCHEMAS_DB_HOST = 'localhost'
    USER_SCHEMAS_DB_PORT = 5432

    FILE_MANAGER_API_URL = 'http://localhost:10500/files-manager'


class DockerConfig:
    APP_LOGIC_DB_NAME = 'shared'
    APP_LOGIC_DB_USER = 'perseus'
    APP_LOGIC_DB_PASSWORD = 'password'
    APP_LOGIC_DB_HOST = 'shareddb'
    APP_LOGIC_DB_PORT = 5432

    USER_SCHEMAS_DB_NAME = 'source'
    USER_SCHEMAS_DB_USER = 'source'
    USER_SCHEMAS_DB_PASSWORD = 'password'
    USER_SCHEMAS_DB_HOST = 'shareddb'
    USER_SCHEMAS_DB_PORT = 5432

    FILE_MANAGER_API_URL = 'http://files-manager:10500/files-manager'


class AzureConfig:
    APP_LOGIC_DB_NAME = os.getenv("SHARED_DB_NAME")
    APP_LOGIC_DB_USER = os.getenv("SHARED_DB_PERSEUS_USER")
    APP_LOGIC_DB_PASSWORD = os.getenv("SHARED_DB_PERSEUS_PASSWORD")
    APP_LOGIC_DB_HOST = os.getenv("SHARED_DB_HOST")
    APP_LOGIC_DB_PORT = os.getenv("SHARED_DB_PORT")

    USER_SCHEMAS_DB_NAME = os.getenv("SOURCE_DB_NAME")
    USER_SCHEMAS_DB_USER = os.getenv("SOURCE_DB_USER")
    USER_SCHEMAS_DB_PASSWORD = os.getenv("SOURCE_DB_PASSWORD")
    USER_SCHEMAS_DB_HOST = os.getenv("SOURCE_DB_HOST")
    USER_SCHEMAS_DB_PORT = os.getenv("SOURCE_DB_PORT")

    FILE_MANAGER_API_URL = os.getenv("FILE_MANAGER_URL")
