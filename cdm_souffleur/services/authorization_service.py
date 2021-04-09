import random
import string

from cdm_souffleur.model.user import *
from cdm_souffleur.services.mailout_service import send_email
from cdm_souffleur.utils import InvalidUsage
from cdm_souffleur.utils.exceptions import AuthorizationError
from cdm_souffleur import bcrypt

unconfirmed_users = {}
user_registration_links = {}

def register_user_in_db(password, first_name, last_name, email):
    email_exists = User.select().where(User.email == email)
    if email_exists.exists() or email in unconfirmed_users:
        raise InvalidUsage('This email already registered', 409)
    encrypted_password = bcrypt.generate_password_hash(
        password, app.config.get('BCRYPT_LOG_ROUNDS')
    ).decode()
    username = f"{first_name[0].lower()}{last_name.lower()}"
    match_pattern = f"{username}\d*"
    users_with_same_username = User.select(fn.Count(User.user_id).alias('count')).where(User.username.regexp(match_pattern))
    for item in users_with_same_username:
        count = item.count
        if count:
            username = f"{username}{count}"
    user = User(username=username, first_name=first_name, last_name=last_name, email=email, password=encrypted_password)
    unconfirmed_users[email] = user
    random_string = generate_random_string()
    user_registration_links[random_string] = email
    send_email(email, 'registration', random_string)

def generate_random_string():
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=30))
    while random_str in user_registration_links:
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=30))
    return random_str

def user_login(email, password):
    auth_token = None
    user = User.select().where(User.email == email)
    if user.exists():
        for item in user:
            if bcrypt.check_password_hash(item.password, password):
                auth_token = item.encode_auth_token(item.username)
            if auth_token:
                return {'username': item.username, 'token': auth_token}
            else:
                raise AuthorizationError('Incorrect password', 401)
    else:
        raise InvalidUsage('User does not exist', 401)

def user_logout(auth_token):
    blacklisted_token = blacklist_token(token=auth_token, blacklisted_on=datetime.datetime.now())
    blacklisted_token.save()
    return True

def reset_password_for_user(email):
    user = User.select().where(User.email == email)
    if user.exists():
        for item in user:
            send_email(item.email)
    else:
        raise InvalidUsage('User does not exist', 401)
    return True

def activate_user_in_db(str):
    if str in user_registration_links:
        user = unconfirmed_users[user_registration_links[str]]
        user.save()
        unconfirmed_users.pop(user_registration_links[str], None)
        user_registration_links.pop(str, None)
    else:
        raise InvalidUsage('User does not exist', 401)
    return True