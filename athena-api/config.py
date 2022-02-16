class LocalConfig:
    PORT = 5050
    APP_PREFIX = '/athena'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = False
    VERSION = 0.3


class DevelopmentConfig:
    PORT = 5050
    APP_PREFIX = '/athena'
    SOLR_HOST = 'athena'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = False
    VERSION = 0.3


class StagingConfig:
    PORT = 5050
    APP_PREFIX = '/athena'
    SOLR_HOST = 'athena'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = True
    VERSION = 0.3


class ProdConfig:
    PORT = 5050
    APP_PREFIX = '/athena'
    SOLR_HOST = 'athena'
    SOLR_PORT = '8983'
    IS_LOCAL = False
    IS_PROD = True
    VERSION = 0.3
