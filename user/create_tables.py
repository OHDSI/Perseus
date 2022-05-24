from db import pg_db
from model import User, BlacklistToken
from model.refreshtoken import RefreshToken
from model.unauthorizedresetpwdrequest import UnauthorizedResetPwdRequest
from utils.password import decode_password


def create_tables():
    pg_db.create_tables([User, UnauthorizedResetPwdRequest, RefreshToken, BlacklistToken])


def create_test_users():
    if User.select().count == 0:
        users = [
            {
                'username': 'perseus',
                'first_name': 'name',
                'last_name': 'surname',
                'email': 'perseus@softwarecountry.com',
                'password': decode_password('perseus'),
                'active': True
            },
            {
                'username': 'perseus-support',
                'first_name': 'name',
                'last_name': 'surname',
                'email': 'perseussupport@softwarecountry.com',
                'password': decode_password('perseus'),
                'active': True
            }
        ]
        User.insert_many(users).execute()