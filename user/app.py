from flask import *
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import logging

app = Flask(__name__)
bcrypt = Bcrypt(app)
env = os.getenv("USER_ENV").capitalize()
app.config.from_object(f'config.{env}Config')
CORS(app)
logger = logging.getLogger('waitress')
logger.setLevel(logging.INFO)
app.logger = logger