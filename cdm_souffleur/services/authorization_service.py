from cdm_souffleur.model.user import *

def register_user_in_db(username, password):
    user = User(username=username, password = password)
    user.save()
    user_id = User.select(User.user_id).where
    auth_token = user.encode_auth_token(user.user_id)
    return auth_token

def login(username, password):
    return True