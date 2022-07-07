import os
import sys

from flask import Flask
from utils.key_vaults import get_secrets


def init_app_config(app: Flask):
    env = os.getenv("USER_ENV").capitalize()
    app.config.from_object(f'config.{env}Config')

    if app.config["AZURE_KEY_VAULT"]:
        app.config.from_mapping(get_secrets())
    else:
        app.config.from_mapping({
            'TOKEN_SECRET_KEY': os.getenv('TOKEN_SECRET_KEY'),
            'EMAIL_SECRET_KEY': os.getenv('EMAIL_SECRET_KEY'),
            'SMTP_SERVER': os.getenv('SMTP_SERVER'),
            'SMTP_PORT': os.getenv('SMTP_PORT'),
            'SMTP_EMAIL': os.getenv('SMTP_EMAIL'),
            'SMTP_USER': os.getenv('SMTP_USER'),
            'SMTP_PWD': os.getenv('SMTP_PWD')
        })
        check_sercret_keys(app)

    print('App config initialized')


def check_sercret_keys(app: Flask):
    if not app.config['TOKEN_SECRET_KEY']:
        print('TOKEN_SECRET_KEY env variable is None', sys.stderr)
        exit(1)
    if not app.config['EMAIL_SECRET_KEY']:
        print('EMAIL_SECRET_KEY env variable is None', sys.stderr)
        exit(1)