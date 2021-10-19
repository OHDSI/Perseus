class LocalConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5000
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SERVER_HOST = 'localhost'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'

class DevelopmentConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5001
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SERVER_HOST = '10.110.1.7:8080'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'


class StagingConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5000
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SERVER_HOST = '10.110.1.7'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'

class ProdConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5000
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SERVER_HOST = '185.134.75.47'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'

