class DefaultConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5000
    DB_NAME = 'testdb'
    DB_USER = 'postgres'
    DB_PASSWORD = 'postgres'
    DB_HOST = 'localhost'
    DB_PORT = 5432
    SECRET_KEY = "\xf9'\xe4p(\xa9\x12\x1a!\x94\x8d\x1c\x99l\xc7\xb7e\xc7c\x86\x02MJ\xa0"
class DevelopmentConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5001
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SECRET_KEY = "\xf9'\xe4p(\xa9\x12\x1a!\x94\x8d\x1c\x99l\xc7\xb7e\xc7c\x86\x02MJ\xa0"