import os

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
env = os.getenv('USAGI_ENV').capitalize()
app.config.from_object(f'config.{env}Config')
CORS(app)