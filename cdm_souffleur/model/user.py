from jwt import ExpiredSignatureError, InvalidTokenError, InvalidSignatureError, DecodeError, PyJWTError
from peewee import *
from cdm_souffleur import app
import jwt
from flask import request
from functools import wraps
import datetime
from cdm_souffleur.model.baseModel import BaseModel
from cdm_souffleur.model.blacklist_token import blacklist_token
from cdm_souffleur.utils import InvalidUsage
import os


class User(BaseModel):
    user_id = AutoField()
    username = CharField(unique=True)
    password = CharField()
    first_name = CharField()
    last_name = CharField()
    email = CharField(unique=True)
    active = BooleanField()

    def encode_auth_token(self, username, **kwargs):
        try:
            payload = {
                'sub': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=43200),
                'iat': datetime.datetime.utcnow(),
            }
            return jwt.encode(
                payload,
                os.getenv("TOKEN_SECRET_KEY"),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        payload = jwt.decode(auth_token, os.getenv("TOKEN_SECRET_KEY"), algorithms='HS256')
        user = User.select().where(User.username == payload['sub']).get()
        is_blacklisted_token = blacklist_token.check_blacklist(auth_token)
        if is_blacklisted_token or not user.active:
           raise InvalidTokenError
        return payload['sub']


def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):

      current_user = is_token_valid(request)

      return f(current_user, *args, **kwargs)
   return decorator

def is_token_valid(request):
    token = None

    if 'Authorization' in request.headers:
        token = request.headers['Authorization']

    if not token:
        raise InvalidUsage('A valid token is missing', 401)

    try:
        current_user = User.decode_auth_token(token)
    except ExpiredSignatureError as error:
        raise InvalidUsage('Token expired. Please log in again', 401)
    except PyJWTError as error:
        raise InvalidUsage('Token is invalid', 401)
    return current_user
