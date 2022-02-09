import urllib
from urllib.request import urlopen
from constants import ATHENA_FULL_DATA_IMPORT, ATHENA_IMPORT_STATUS


def run_solr_command(solr_connection_string, command, current_user = ''):
    resource = urllib.request.urlopen(f"{solr_connection_string}/{command}{current_user}")
    content = resource.read().decode(resource.headers.get_content_charset())
    return content


def check_index_created(solr_connection_string):
    response = run_solr_command(solr_connection_string, ATHENA_IMPORT_STATUS)
    if 'Indexing completed.' in response:
        return True
    return False


def create_index_if_not_exist(logger, solr_connection_string):
    if check_index_created(solr_connection_string):
        logger.info("Solr data already imported")
    else:
        result = run_solr_command(solr_connection_string, ATHENA_FULL_DATA_IMPORT)
        logger.info("Run solr data import command with result %s", result)
