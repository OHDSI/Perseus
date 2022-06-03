PORT = 5001
APP_PREFIX = '/user'
VERSION = 0.4


class LocalConfig:
    AZURE_KEY_VAULT = False
    DB_NAME = 'shared'
    DB_USER = 'user'
    DB_PASSWORD = 'password'
    DB_HOST = 'localhost'
    DB_PORT = 5432


class DockerConfig:
    AZURE_KEY_VAULT = False
    DB_NAME = 'shared'
    DB_USER = 'user'
    DB_PASSWORD = 'password'
    DB_HOST = 'shareddb'
    DB_PORT = 5432


class AzureConfig:
    AZURE_KEY_VAULT = True
