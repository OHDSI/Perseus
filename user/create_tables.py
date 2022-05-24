from db import pg_db
from model import User, BlacklistToken
from model.refreshtoken import RefreshToken
from model.unauthorizedresetpwdrequest import UnauthorizedResetPwdRequest
from utils.password import decode_password


def create_tables():
    pg_db.create_tables([User, UnauthorizedResetPwdRequest, RefreshToken, BlacklistToken])


def create_test_users():
    if User.select().count() == 0:
        print("Creating test users...")
        users = [
            {
                'username': 'perseus',
                'first_name': 'Perseus',
                'last_name': 'Perseus',
                'email': 'perseus@softwarecountry.com',
                'password': decode_password('perseus'),
                'active': True
            },
            {
                'username': 'perseus-support',
                'first_name': 'Perseus',
                'last_name': 'Support',
                'email': 'perseussupport@softwarecountry.com',
                'password': decode_password('perseus'),
                'active': True
            }
        ]
        User.insert_many(users).execute()
        print('Test users created!')
    else:
        print('Users found in the database. Skipping creating test users.')