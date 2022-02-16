from flask import *
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
bcrypt = Bcrypt(app)
env = os.getenv("PERSEUS_ENV").capitalize()
app.config.from_object(f'config.{env}Config')
CORS(app)

