PORT = 5003
APP_PREFIX = '/usagi'
VERSION = 0.4
IMPORT_DATA_TO_SOLR = False


class LocalConfig:
    AZURE_KEY_VAULT = False
    SOLR_URL = 'http://localhost:8983'

    USAGI_DB_NAME = 'shared'
    USAGI_DB_USER = 'usagi'
    USAGI_DB_PASSWORD = 'password'
    USAGI_DB_HOST = 'localhost'
    USAGI_DB_PORT = 5432

    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'vocabulary'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'localhost'
    VOCABULARY_DB_PORT = 5431

    SOLR_USER = 'solr'
    SOLR_PASSWORD = 'SolrRocks'


class DockerConfig:
    AZURE_KEY_VAULT = False
    SOLR_URL = 'http://solr:8983'

    USAGI_DB_NAME = 'shared'
    USAGI_DB_USER = 'usagi'
    USAGI_DB_PASSWORD = 'password'
    USAGI_DB_HOST = 'shareddb'
    USAGI_DB_PORT = 5432

    VOCABULARY_DB_NAME = 'vocabulary'
    VOCABULARY_DB_USER = 'vocabulary'
    VOCABULARY_DB_PASSWORD = 'password'
    VOCABULARY_DB_HOST = 'vocabularydb'
    VOCABULARY_DB_PORT = 5432

    SOLR_USER = 'solr'
    SOLR_PASSWORD = 'SolrRocks'


class AzureConfig:
    AZURE_KEY_VAULT = True
