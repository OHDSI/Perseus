PORT = 5002
APP_PREFIX = '/athena'
VERSION = 0.4


class LocalConfig:
    SOLR_HOST = 'localhost'
    SOLR_PORT = '8983'


class DockerConfig:
    SOLR_HOST = 'solr'
    SOLR_PORT = '8983'
