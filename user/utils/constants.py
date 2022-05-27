import os
import sys

from app import app

SMTP_PORT_STL = 587

PASSWORD_LINK_EXPIRATION_TIME = 172800  # 48 hours
REGISTRATION_LINK_EXPIRATION_TIME = 172800 # 48 hours
USERNAME_HEADER = 'Username'
AUTHORIZATION_HEADER = 'Authorization'

TOKEN_SECRET_KEY = os.getenv("TOKEN_SECRET_KEY")
EMAIL_SECRET_KEY = os.getenv("EMAIL_SECRET_KEY")

if TOKEN_SECRET_KEY is None:
    print('TOKEN_SECRET_KEY env variable is None', sys.stderr)
    exit(1)
if EMAIL_SECRET_KEY is None:
    print('EMAIL_SECRET_KEY env variable is None', sys.stderr)
    exit(1)