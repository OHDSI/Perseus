import os
from flask import Flask
from util.key_vaults import get_secrets


def init_app_config(app: Flask):
    env = os.getenv("USAGI_ENV").capitalize()
    app.config.from_object(f'config.{env}Config')
    if app.config["AZURE_KEY_VAULT"]:
        app.config.from_mapping(get_secrets())
    print('App config initialized')