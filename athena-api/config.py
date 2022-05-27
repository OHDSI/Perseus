PORT = 5002
APP_PREFIX = '/athena'
VERSION = 0.4


class LocalConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'perseus'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'vocabularydb'
    VOCABULARY_DB_PORT = 5432


class DockerConfig:
    SOLR_HOST = 'solr'
    SOLR_PORT = '8983'
    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'perseus'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'vocabularydb'
    VOCABULARY_DB_PORT = 5432
