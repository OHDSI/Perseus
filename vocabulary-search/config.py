class LocalConfig:
    PORT = 5050
    APP_PREFIX = '/vocabulary-search'
    SOLR_HOST = 'jnjcicdu1'
    SOLR_PORT = '8983'
    IS_PROD = False


class DevelopmentConfig:
    PORT = 5050
    APP_PREFIX = '/vocabulary-search'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_PROD = False


class StagingConfig:
    PORT = 5050
    APP_PREFIX = '/vocabulary-search'
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_PROD = True


class ProdConfig:
    PORT = 5050
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'
    IS_PROD = True
