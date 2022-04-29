PORT = 5001
APP_PREFIX = '/user'
VERSION = 0.4


class LocalConfig:
    DB_NAME = 'shared'
    DB_USER = 'user'
    DB_PASSWORD = 'password'
    DB_HOST = 'localhost'
    DB_PORT = 5432
    EMAIL_SECRET_KEY = '8cmuh4t5xTtR1EHaojWL0aqCR3vZ48PZF5AYkTe0iqo='


class DockerConfig:
    DB_NAME = 'shared'
    DB_USER = 'user'
    DB_PASSWORD = 'password'
    DB_HOST = 'shareddb'
    DB_PORT = 5432
    EMAIL_SECRET_KEY = '8cmuh4t5xTtR1EHaojWL0aqCR3vZ48PZF5AYkTe0iqo='
