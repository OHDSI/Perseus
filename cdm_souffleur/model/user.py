from peewee import *
from cdm_souffleur.db import pg_db
from cdm_souffleur import app, bcrypt
import jwt
from flask import request, jsonify
from functools import wraps


class BaseModel(Model):
    class Meta:
        database = pg_db
        schema = 'cdm'

class User(BaseModel):
    user_id = AutoField()
    username = CharField(unique=True)
    password = CharField()

    def encode_auth_token(self, user_id, **kwargs):
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

    @staticmethod
    def decode_auth_token(auth_token):
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'), algorithms='HS256')
        return payload['sub']

def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):

      token = None

      if 'Authorization' in request.headers:
         token = request.headers['Authorization']

      if not token:
         return jsonify({'message': 'a valid token is missing'})

      try:
         current_user = User.decode_auth_token(token)
      except:
         return jsonify({'message': 'token is invalid'})

      return f(current_user, *args, **kwargs)
   return decorator