import os

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


class AzureConfig:
    SOLR_HOST = os.getenv("SOLR_HOST")
    SOLR_PORT = os.getenv("SOLR_PORT")
    VOCABULARY_DB_NAME = os.getenv("VOCABULARY_DB_NAME")
    VOCABULARY_DB_USER = os.getenv("VOCABULARY_DB_ATHENA_USER")
    VOCABULARY_DB_PASSWORD = os.getenv("VOCABULARY_DB_ATHENA_PASSWORD")
    VOCABULARY_DB_HOST = os.getenv("VOCABULARY_DB_HOST")
    VOCABULARY_DB_PORT = os.getenv("VOCABULARY_DB_PORT")
