import json
import urllib
from urllib.request import urlopen

from app import app
from utils.constants import ATHENA_CORE_NAME
from service import search_service


def run_solr_command(command, current_user = ''):
    resource = urllib.request.urlopen(f"{app.config['SOLR_URL']}/{command}{current_user}")
    content = resource.read().decode(resource.headers.get_content_charset())
    return content


def create_index_if_not_exist(logger):
    count = search_service.count()
    if count != 0:
        logger.info("Athena Solr data already imported")
    else:
        import_status_command = f"solr/{ATHENA_CORE_NAME}/dataimport?command=status&indent=on&wt=json"
        status_response_str = run_solr_command(import_status_command)
        status_response = json.loads(status_response_str)
        status = status_response['status']
        if status == 'busy':
            logger.info("The import data process has already started")
        else:
            db_host = app.config['VOCABULARY_DB_HOST']
            dp_port = app.config['VOCABULARY_DB_PORT']
            dp_name = app.config['VOCABULARY_DB_NAME']
            db_user = app.config['VOCABULARY_DB_USER']
            db_password = app.config['VOCABULARY_DB_PASSWORD']
            full_import_command = f"solr/{ATHENA_CORE_NAME}/dataimport?command=full-import" \
                                  f"&jdbcurl=jdbc:postgresql://{db_host}:{dp_port}/{dp_name}" \
                                  f"&jdbcuser={db_user}" \
                                  f"&jdbcpassword={db_password}"
            result = run_solr_command(full_import_command)
            logger.info("Run solr data import command with result %s", result)
