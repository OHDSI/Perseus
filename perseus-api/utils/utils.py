from flask import request
from functools import wraps

from app import app
from utils import InvalidUsage


def getServerHostPort(host):
    if 'SERVER_PORT' in app.config:
        return f"http://{host}:{app.config['SERVER_PORT']}"
    return f"http://{host}"


def username_header(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        current_user = request.headers.get('Username')
        if current_user is None:
            raise InvalidUsage('Username header not present')
        return f(current_user, *args, **kwargs)

    return decorator
