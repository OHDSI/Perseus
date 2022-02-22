PORT = 5150
APP_PREFIX = '/usagi'
VERSION = 0.3
TOKEN_SECRET_KEY = 'Perseus-Arcad!a'


class LocalConfig:
    SOLR_HOST = 'jnjcicdu1'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = False

    USAGI_DB_NAME = 'cdm_souffleur'
    USAGI_DB_USER = 'postgres'
    USAGI_DB_PASSWORD = '5eC_DkMr^3'
    USAGI_DB_HOST = 'jnjcicdu1'
    USAGI_DB_PORT = '5431'

    VOCABULARY_DB_NAME = 'cdm_souffleur'
    VOCABULARY_DB_USER = 'postgres'
    VOCABULARY_DB_PASSWORD = '5eC_DkMr^3'
    VOCABULARY_DB_HOST = 'jnjcicdu1'
    VOCABULARY_DB_PORT = '5431'

    USER_DB_NAME = 'cdm_souffleur'
    USER_DB_USER = 'postgres'
    USER_DB_PASSWORD = '5eC_DkMr^3'
    USER_DB_HOST = 'jnjcicdu1'
    USER_DB_PORT = '5431'


class DevelopmentConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = False

    USAGI_DB_NAME = 'cdm_souffleur'
    USAGI_DB_USER = 'postgres'
    USAGI_DB_PASSWORD = '5eC_DkMr^3'
    USAGI_DB_HOST = 'localhost'
    USAGI_DB_PORT = '5431'

    VOCABULARY_DB_NAME = 'cdm_souffleur'
    VOCABULARY_DB_USER = 'postgres'
    VOCABULARY_DB_PASSWORD = '5eC_DkMr^3'
    VOCABULARY_DB_HOST = 'localhost'
    VOCABULARY_DB_PORT = '5431'

    USER_DB_NAME = 'cdm_souffleur'
    USER_DB_USER = 'postgres'
    USER_DB_PASSWORD = '5eC_DkMr^3'
    USER_DB_HOST = 'localhost'
    USER_DB_PORT = '5431'


class StagingConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = True

    USAGI_DB_NAME = 'cdm_souffleur'
    USAGI_DB_USER = 'postgres'
    USAGI_DB_PASSWORD = '5eC_DkMr^3'
    USAGI_DB_HOST = 'localhost'
    USAGI_DB_PORT = '5431'

    VOCABULARY_DB_NAME = 'cdm_souffleur'
    VOCABULARY_DB_USER = 'postgres'
    VOCABULARY_DB_PASSWORD = '5eC_DkMr^3'
    VOCABULARY_DB_HOST = 'localhost'
    VOCABULARY_DB_PORT = '5431'

    USER_DB_NAME = 'cdm_souffleur'
    USER_DB_USER = 'postgres'
    USER_DB_PASSWORD = '5eC_DkMr^3'
    USER_DB_HOST = 'localhost'
    USER_DB_PORT = '5431'


class ProdConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = True

    USAGI_DB_NAME = 'cdm_souffleur'
    USAGI_DB_USER = 'postgres'
    USAGI_DB_PASSWORD = '5eC_DkMr^3'
    USAGI_DB_HOST = 'localhost'
    USAGI_DB_PORT = '5431'

    VOCABULARY_DB_NAME = 'cdm_souffleur'
    VOCABULARY_DB_USER = 'postgres'
    VOCABULARY_DB_PASSWORD = '5eC_DkMr^3'
    VOCABULARY_DB_HOST = 'localhost'
    VOCABULARY_DB_PORT = '5431'

    USER_DB_NAME = 'cdm_souffleur'
    USER_DB_USER = 'postgres'
    USER_DB_PASSWORD = '5eC_DkMr^3'
    USER_DB_HOST = 'localhost'
    USER_DB_PORT = '5431'
