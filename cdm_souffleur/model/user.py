from peewee import *
from cdm_souffleur.db import pg_db
from cdm_souffleur import app, bcrypt
import jwt


class BaseModel(Model):
    class Meta:
        database = pg_db
        schema = 'cdm'

class User(BaseModel):
    user_id = AutoField()
    username = CharField(unique=True)
    password = CharField()

    def __init__(self, username, password):
        super(BaseModel, self).__init__()
        self.username = username
        self.password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()

    def encode_auth_token(self, user_id):
        try:
            payload = {
                'sub': user_id
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e