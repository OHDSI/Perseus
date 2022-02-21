PORT = 5000
APP_PREFIX = '/perseus'
VERSION = 0.3


class LocalConfig:
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'jnjcicdu1'
    DB_PORT = 5431
    EMAIL_SECRET_KEY = '8cmuh4t5xTtR1EHaojWL0aqCR3vZ48PZF5AYkTe0iqo='


class DevelopmentConfig:
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    EMAIL_SECRET_KEY = '8cmuh4t5xTtR1EHaojWL0aqCR3vZ48PZF5AYkTe0iqo='


class StagingConfig:
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    EMAIL_SECRET_KEY = '8cmuh4t5xTtR1EHaojWL0aqCR3vZ48PZF5AYkTe0iqo='


class ProdConfig:
    DB_NAME = 'cdm_souffleur'
    DB_USER = 'postgres'
    DB_PASSWORD = '5eC_DkMr^3'
    DB_HOST = 'localhost'
    DB_PORT = 5431
    EMAIL_SECRET_KEY = '8cmuh4t5xTtR1EHaojWL0aqCR3vZ48PZF5AYkTe0iqo='
