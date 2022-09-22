from app import app


def getServerHostPort(host):
    if 'SERVER_PORT' in app.config:
        return f"http://{host}:{app.config['SERVER_PORT']}"
    else:
        return f"http://{host}"
