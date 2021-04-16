from werkzeug.utils import redirect
from cdm_souffleur.model.unauthorized_reset_pwd_request import unauthorized_reset_pwd_request
from cdm_souffleur.model.user import *
from cdm_souffleur.services.mailout_service import send_email
from cdm_souffleur.utils import InvalidUsage
from cdm_souffleur.utils.constants import REGISTRATION_LINK_EXPIRATION_TIME, PASSWORD_LINK_EXPIRATION_TIME
from cdm_souffleur.utils.exceptions import AuthorizationError
from cdm_souffleur import bcrypt
from cryptography.fernet import Fernet
import atexit
from apscheduler.schedulers.background import BackgroundScheduler


user_registration_links = {}
reset_pwd_links = {}
key = Fernet.generate_key()
fernet = Fernet(app.config.get('EMAIL_ENCODE_KEY'))


def refresh_registration_links():
    global user_registration_links, reset_pwd_links
    user_registration_links = {key: value for key, value in user_registration_links.items() if
      (datetime.datetime.now() - value).total_seconds() < REGISTRATION_LINK_EXPIRATION_TIME}
    reset_pwd_links = {key: value for key, value in reset_pwd_links.items() if
      (datetime.datetime.now() - value).total_seconds() < PASSWORD_LINK_EXPIRATION_TIME}


scheduler = BackgroundScheduler()
scheduler.add_job(func=refresh_registration_links, trigger="interval", seconds=86400)  #24 hours
scheduler.start()

atexit.register(lambda: scheduler.shutdown())


def register_user_in_db(password, first_name, last_name, email):
    encrypted_password = bcrypt.generate_password_hash(
        password, app.config.get('BCRYPT_LOG_ROUNDS')
    ).decode()
    user = User.select().where(User.email == email)
    if user.exists():
        if user.get().active:
            raise InvalidUsage('This email already exists', 409)
        else:
            update_user_fields(user.get(), first_name, last_name, encrypted_password)
            send_link_to_user(email, first_name, 'registration', user_registration_links)
            return
    username = f"{first_name[0].lower()}{last_name.lower()}"
    match_pattern = f"{username}\d*"
    users_with_same_username = User.select(fn.Count(User.user_id).alias('count')).where(User.username.regexp(match_pattern))
    for item in users_with_same_username:
        count = item.count
        if count:
            username = f"{username}{count}"
    user = User(username=username, first_name=first_name, last_name=last_name, email=email, password=encrypted_password, active=False)
    user.save()
    send_link_to_user(email, first_name, 'registration', user_registration_links)


def decrypt_email(str):
    return fernet.decrypt(str.encode()).decode()


def update_user_fields(user, first_name, last_name, encrypted_password):
    user = user.get()
    user.first_name = first_name
    user.last_name = last_name
    user.password = encrypted_password
    user.save()


def send_link_to_user(email, first_name, link_type, links_storage):
    encrypted_email = fernet.encrypt(email.encode()).decode()
    links_storage[email] = datetime.datetime.now()
    send_email(email, first_name, link_type, encrypted_email)


def send_link_to_user_repeatedly(email, linkType):
    user = User.select().where(User.email == email)
    if user.exists():
        if not user.get().active:
            raise InvalidUsage('User has not been activated', 401)
        if linkType == 'registration':
            send_link_to_user(email, user.get().first_name, linkType, user_registration_links)
        else:
            send_link_to_user(email, user.get().first_name, linkType, reset_pwd_links)


def activate_user_in_db(str):
    decrypted_email = fernet.decrypt(str.encode()).decode()
    user = User.select().where(User.email == decrypted_email)
    if user.exists() and user.get().active:
        return redirect(f"http://{app.config['SERVER_HOST']}/already-registered?email={decrypted_email}", code=302)
    if decrypted_email in user_registration_links:
        selected_user = user.get()
        selected_user.active = True
        selected_user.save()
        user_registration_links.pop(decrypted_email, None)
        return redirect(f"http://{app.config['SERVER_HOST']}", code=302)
    else:
        return redirect(f"http://{app.config['SERVER_HOST']}/link-expired?linkType=email&email={decrypted_email}", code=302)


def user_login(email, password):
    auth_token = None
    user = User.select().where(User.email == email)
    if user.exists():
        if not user.get().active:
            raise InvalidUsage('User has not been activated', 401)
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


def send_reset_password_email(email):
    user = User.select().where(User.email == email)
    if user.exists():
        if not user.get().active:
            raise InvalidUsage('User has not been activated', 401)
        for item in user:
            send_link_to_user(item.email, item.first_name, 'reset_password', reset_pwd_links)
    else:
        raise InvalidUsage('Email wasn\'t registered', 401)
    return True


def password_link_active(encrypted_email):
    return fernet.decrypt(encrypted_email.encode()).decode() in reset_pwd_links


def reset_password_for_user(new_pwd, encrypted_email):
    decrypted_email = fernet.decrypt(encrypted_email.encode()).decode()
    user = User.select().where(User.email == decrypted_email).get()
    if not user.active:
        raise InvalidUsage('User is not active', 401)
    encrypted_password = bcrypt.generate_password_hash(new_pwd, app.config.get('BCRYPT_LOG_ROUNDS')).decode()
    user.password = encrypted_password
    user.save()
    if encrypted_email in reset_pwd_links:
        reset_pwd_links.pop(encrypted_email, None)


def register_unauthorized_reset_pwd_in_db(user_key):
    if user_key in reset_pwd_links:
        user = User.select().where(User.email == reset_pwd_links[user_key]).get()
        report = unauthorized_reset_pwd_request(username=user.username, report_date=datetime.datetime.utcnow())
        report.save()
        reset_pwd_links.pop(user_key, None)
    else:
        raise InvalidUsage('User does not exist', 401)
