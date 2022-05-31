import datetime

from functools import wraps
from flask import request
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError, PyJWTError
from peewee import AutoField, BooleanField, CharField

from model import BlacklistToken
from model.baseModel import BaseModel
from utils.constants import TOKEN_SECRET_KEY
from utils.exceptions import InvalidUsage


class User(BaseModel):
    user_id = AutoField()
    username = CharField(unique=True)
    password = CharField()
    first_name = CharField()
    last_name = CharField()
    email = CharField(unique=True)
    active = BooleanField()

    def encode_auth_token(self, username, **kwargs):
        exp = datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=43200)
        try:
            payload = {
                'sub': username,
                'exp': exp,
                'iat': datetime.datetime.utcnow(),
            }
            return encode(
                payload,
                TOKEN_SECRET_KEY,
                algorithm='HS256'
            ), exp
        except Exception as e:
            raise InvalidUsage("Can not encode jwt token", 500)

    @staticmethod
    def decode_auth_token(auth_token):
        payload = decode(auth_token, TOKEN_SECRET_KEY, algorithms='HS256')
        user = User.select().where(User.username == payload['sub']).get()
        is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
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
        return User.decode_auth_token(token)
    except ExpiredSignatureError as error:
        raise InvalidUsage('Token expired. Please log in again', 401)
    except PyJWTError as error:
        raise InvalidUsage('Token is invalid', 401)
