class DefaultConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5000
    REMOTE_PORT = 4200
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SECRET_KEY = "\xac\xe3\xc1\x8ft\x8d\x7fM\x82\x18\xbeM\xc7k*\xd5]\xae(J\xe6}\xe84"
    SMTP_SERVER = 'mail.arcadialab.ru'
    SMTP_PORT = 587
    SMTP_EMAIL = 'perseus_test@arcadialab.ru'
    SMTP_USER = 'perseus_test'
    SMTP_PWD = 'PT4TYxou@?cH8J'

class DevelopmentConfig:
    CDM_SOUFFLEUR_PREFIX = ''
    CDM_SOUFFLEUR_PORT = 5001
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    SECRET_KEY = "\xac\xe3\xc1\x8ft\x8d\x7fM\x82\x18\xbeM\xc7k*\xd5]\xae(J\xe6}\xe84"