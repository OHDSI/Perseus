import urllib
from app import app
import json
from util.constants import USAGI_FULL_DATA_IMPORT, USAGI_IMPORT_STATUS
from service import search_service


def run_solr_command(command, current_user = ''):
    resource = urllib.request.urlopen(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/{command}{current_user}")
    content = resource.read().decode(resource.headers.get_content_charset())
    return content

def create_index_if_not_exist(logger, solr_connection_string):
    count = search_service.count()
    if count != 0:
        logger.info("Solr data already imported")
    else:
        status_response_str = run_solr_command(solr_connection_string, USAGI_IMPORT_STATUS)
        status_response = json.loads(status_response_str)
        status = status_response['status']
        if status == 'busy':
            logger.info("The import data process has already started")
        else:
            result = run_solr_command(solr_connection_string, USAGI_FULL_DATA_IMPORT)
            logger.info("Run solr data import command with result %s", result)