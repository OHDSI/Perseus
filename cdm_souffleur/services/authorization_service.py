from cdm_souffleur.model.user import *

def register_user_in_db(username, password):
    encrypted_password = bcrypt.generate_password_hash(
        password, app.config.get('BCRYPT_LOG_ROUNDS')
    ).decode()
    user = User(username=username, password=encrypted_password)
    user.save()
    auth_token = user.encode_auth_token(user.username)
    return auth_token

def user_login(username, password):
    try:
        user = User.select().where(User.username == username)
        if user.exists():
            for item in user:
                if bcrypt.check_password_hash(item.password, password):
                    auth_token = item.encode_auth_token(item.user_id)
                if auth_token:
                    return auth_token
        else:
            return 'User does not exist'
    except Exception as e:
        return 'Login failed'

