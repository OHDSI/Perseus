PORT = 5002
APP_PREFIX = '/athena'
VERSION = 0.4


class LocalConfig:
    AZURE_KEY_VAULT = False
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'perseus'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'vocabularydb'
    VOCABULARY_DB_PORT = 5432


class DockerConfig:
    AZURE_KEY_VAULT = False
    SOLR_HOST = 'solr'
    SOLR_PORT = '8983'
    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'perseus'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'vocabularydb'
    VOCABULARY_DB_PORT = 5432


class AzureConfig:
    AZURE_KEY_VAULT = True