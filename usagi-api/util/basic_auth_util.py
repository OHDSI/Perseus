from requests.auth import HTTPBasicAuth
from app import app


def create_auth():
    return HTTPBasicAuth(username=app.config['SOLR_USER'], password=app.config['SOLR_PASSWORD'])