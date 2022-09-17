from flask import request
from functools import wraps
from utils import InvalidUsage


def username_header(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        current_user = request.headers.get('Username')
        if current_user is None:
            raise InvalidUsage('Username header not present')
        return f(current_user, *args, **kwargs)

    return decorator
