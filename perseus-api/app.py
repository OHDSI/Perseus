import logging
from logging.config import dictConfig
from flask import Flask
from flask_cors import CORS
from app_config import init_app_config
from log import LevelFilter

dictConfig({
    'version': 1,
    'formatters': {
        'default': {'format': '[%(asctime)s] %(levelname)s: %(message)s'}
    },
    'filters': {
        'info_filter': {
            '()': LevelFilter,
            'max_level': logging.WARNING,
        },
        'error_filter': {
            '()': LevelFilter,
            'max_level': logging.CRITICAL,
        }
    },
    'handlers': {
        'info_handler': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
            'formatter': 'default',
            'level': 'INFO',
            'filters': ['info_filter']
        },
        'error_handler': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://flask.logging.wsgi_errors_stream',
            'formatter': 'default',
            'level': 'ERROR',
            'filters': ['error_filter']
        }
    },
    'root': {
        'level': 'INFO',
        'handlers': ['info_handler', 'error_handler']
    }
})

app = Flask(__name__)
init_app_config(app)
CORS(app)