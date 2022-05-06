PORT = 5003
APP_PREFIX = '/usagi'
VERSION = 0.4
TOKEN_SECRET_KEY = 'Perseus-Arcad!a'


class LocalConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = 8983

    USAGI_DB_NAME = 'shared'
    USAGI_DB_USER = 'usagi'
    USAGI_DB_PASSWORD = 'password'
    USAGI_DB_HOST = 'localhost'
    USAGI_DB_PORT = 5432

    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'perseus'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'localhost'
    VOCABULARY_DB_PORT = 5431

    FILE_MANAGER_API_URL = 'http://localhost:10500/files-manager'

    USER_DB_NAME = 'cdm_souffleur'
    USER_DB_USER = 'postgres'
    USER_DB_PASSWORD = '5eC_DkMr^3'
    USER_DB_HOST = 'jnjcicdu1'
    USER_DB_PORT = '5431'


class DockerConfig:
    SOLR_HOST = 'solr'
    SOLR_PORT = 8983

    USAGI_DB_NAME = 'shared'
    USAGI_DB_USER = 'usagi'
    USAGI_DB_PASSWORD = 'password'
    USAGI_DB_HOST = 'shareddb'
    USAGI_DB_PORT = 5432

    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'perseus'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'vocabularydb'
    VOCABULARY_DB_PORT = 5432

    FILE_MANAGER_API_URL = 'http://files-manager:10500/files-manager'

    USER_DB_NAME = 'cdm_souffleur'
    USER_DB_USER = 'postgres'
    USER_DB_PASSWORD = '5eC_DkMr^3'
    USER_DB_HOST = 'jnjcicdu1'
    USER_DB_PORT = '5431'