PORT = 5050
APP_PREFIX = '/athena'
VERSION = 0.3


class LocalConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'


class DevelopmentConfig:
    SOLR_HOST = 'athena'
    SOLR_PORT = '8983'


class StagingConfig:
    SOLR_HOST = 'athena'
    SOLR_PORT = '8983'


class ProdConfig:
    SOLR_HOST = 'athena'
    SOLR_PORT = '8983'
