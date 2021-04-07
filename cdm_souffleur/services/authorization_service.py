from cdm_souffleur.model.blacklist_token import blacklist_token
from cdm_souffleur.model.user import *
from cdm_souffleur.utils import InvalidUsage
from cdm_souffleur.utils.exceptions import AuthorizationError
from cdm_souffleur import bcrypt


def register_user_in_db(password, first_name, last_name, email):
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
    user.save()
    auth_token = user.encode_auth_token(user.username)
    return {'username': username, 'token': auth_token}

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