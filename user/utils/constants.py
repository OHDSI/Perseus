import os
import sys

from app import app

SMTP_PORT_STL = 587

PASSWORD_LINK_EXPIRATION_TIME = 172800  # 48 hours
REGISTRATION_LINK_EXPIRATION_TIME = 172800 # 48 hours

os_env = os.getenv("TOKEN_SECRET_KEY")
if os_env is None:
    print('TOKEN_SECRET_KEY env variable is None', sys.stderr)
    exit(1)
TOKEN_SECRET_KEY = os_env
EMAIL_SECRET_KEY = app.config["EMAIL_SECRET_KEY"]