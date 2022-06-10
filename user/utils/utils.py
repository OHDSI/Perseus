import os

from app import app
from utils.exceptions import InvalidUsage


def getServerHostPort(host):
    if app.config['AZURE_KEY_VAULT']:
        server_address = os.getenv('SERVER_ADDRESS')
        if not server_address:
            raise InvalidUsage('SERVER_ADDRESS environment variable not specified', 500)
        return server_address
    elif 'SERVER_PORT' in app.config:
        return f"http://{host}:{app.config['SERVER_PORT']}"
    else:
        return f"http://{host}"
