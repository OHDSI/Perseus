from flask import *
import os
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_object(f'config.{os.getenv("CDM_SOUFFLEUR_ENV").capitalize()}Config')

