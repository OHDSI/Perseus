import logging
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from app_config import init_app_config

app = Flask(__name__)
bcrypt = Bcrypt(app)
init_app_config(app)
CORS(app)
logger = logging.getLogger('waitress')
logger.setLevel(logging.INFO)
app.logger = logger
