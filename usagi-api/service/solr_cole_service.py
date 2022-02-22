import urllib
from app import app


def run_solr_command(command, current_user = ''):
    resource = urllib.request.urlopen(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/{command}{current_user}")
    content = resource.read().decode(resource.headers.get_content_charset())
    return content