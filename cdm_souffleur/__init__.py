from flask import *
import os

app = Flask(__name__)
app.config.from_object(f'config.{os.getenv("CDM_SOUFFLEUR_ENV").capitalize()}Config')