import traceback

from flask import request, jsonify, Blueprint
from urllib.parse import urlparse
from werkzeug.exceptions import BadRequestKeyError

from app import app
from config import APP_PREFIX, VERSION
from model.user import token_required, is_token_valid
from services.authorization_service import activate_user_in_db,\
     decrypt_email, password_link_active, get_refresh_access_token_pair,\
     register_unauthorized_reset_pwd_in_db, reset_password_for_user,\
     redirect, register_user_in_db,\
     send_reset_password_email, send_link_to_user_repeatedly,\
     user_login, user_logout
from utils.exceptions import InvalidUsage, AuthorizationError
from utils.utils import getServerHostPort


user_api = Blueprint('authorization_api', __name__, url_prefix=APP_PREFIX)


@user_api.route('/api/info', methods=['GET'])
def app_info():
    app.logger.info("REST request to GET app info")
    return jsonify({'name': 'User', 'version': VERSION})


@user_api.route('/api/register', methods=['POST'])
def register_user():
    app.logger.info("REST request to register new user")
    try:
        host = getServerHostPort(urlparse(request.base_url).hostname)
        password = request.json['password']
        first_name = request.json['firstName']
        last_name = request.json['lastName']
        email = request.json['email']
        register_user_in_db(password, first_name, last_name, email, host)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f'Unable to register user: {error.__str__()}', 500)
    return jsonify(True)


@user_api.route('/api/confirm_registration', methods=['GET'])
def confirm_registration():
    app.logger.info("REST request to confirm registration")
    try:
        host = getServerHostPort(urlparse(request.base_url).hostname)
        encrypted_email = request.args['token']
        redirect_to_page = activate_user_in_db(encrypted_email, host)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f'Unable to confirm registration: {error.__str__()}', 500)

    return redirect_to_page


@user_api.route('/api/login', methods=['POST'])
def login():
    app.logger.info("REST request to login user")
    try:
        email = request.json['email']
        password = request.json['password']
        auth_token = user_login(email, password)
    except InvalidUsage as error:
        raise error
    except AuthorizationError as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f'Unable to login user: {error.__str__()}', 500)
    return jsonify(auth_token)


@user_api.route('/api/logout', methods=['GET'])
@token_required
def logout(current_user):
    app.logger.info("REST request to logout user")
    try:
        user_logout(current_user, request.headers['Authorization'])
    except Exception as error:
        raise InvalidUsage(f'Unable to logout user: {error.__str__()}', 500)
    return jsonify()


@user_api.route('/api/recover-password', methods=['POST'])
def reset_password_request():
    app.logger.info("REST request to recover password")
    try:
        host = getServerHostPort(urlparse(request.base_url).hostname)
        email = request.json['email']
        send_reset_password_email(email, host)
    except Exception as error:
        raise InvalidUsage(f'Unable to recover password: {error.__str__()}', 500)
    return jsonify(True)


@user_api.route('/api/check_password_link', methods=['GET'])
def check_reset_password_link():
    app.logger.info("REST request to check password link")
    try:
        host = getServerHostPort(urlparse(request.base_url).hostname)
        encrypted_email = request.args['token']
        if password_link_active(encrypted_email):
            return redirect(f"{host}/reset-password?token={encrypted_email}", code=302)
    except Exception as error:
        raise InvalidUsage(f'Unable to check password link: {error.__str__()}', 500)
    return redirect(f"{host}/link-expired?linkType=password&email={decrypt_email(encrypted_email)}", code=302)


@user_api.route('/api/reset-password', methods=['POST'])
def reset_password():
    app.logger.info("REST request to reset password")
    try:
        new_pwd = request.json['password']
        encrypted_email = request.json['token']
        reset_password_for_user(new_pwd, encrypted_email)
    except Exception as error:
        raise InvalidUsage(f'Unable to reset password: {error.__str__()}', 500)
    return jsonify(True)


@user_api.route('/api/resend_activation_link', methods=['POST'])
def resend_activation_link():
    app.logger.info("REST request to resend activation link")
    try:
        host = getServerHostPort(urlparse(request.base_url).hostname)
        email = request.json['email']
        linkType = request.json['linkType']
        send_link_to_user_repeatedly(email, linkType, host)
    except Exception as error:
        raise InvalidUsage(f'Unable to resend activation link: {error.__str__()}', 500)
    return jsonify(True)


@user_api.route('/api/register_unauthorized_reset_pwd_request', methods=['GET'])
def register_unauthorized_reset_pwd():
    app.logger.info("REST request to register unauthorized reset password request")
    try:
        host = getServerHostPort(urlparse(request.base_url).hostname)
        user_key = request.args['token']
        register_unauthorized_reset_pwd_in_db(user_key)
    except Exception as error:
        raise InvalidUsage(f'Unable to register unauthorized reset password request: {error.__str__()}', 500)
    return redirect(f"{host}", code=302)


@user_api.route('/api/update_refresh_access_token', methods=['POST'])
def refresh_access_token():
    app.logger.info("REST request to refresh access token")
    try:
        token = request.json['token']
        email = request.json['email']
        tokens = get_refresh_access_token_pair(email, token)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(f'Unable to refresh access token: {error.__str__()}', 500)
    return jsonify(tokens)


@user_api.route('/api/is_token_valid', methods=['GET'])
def is_token_valid_call():
    app.logger.info("REST request to check if token is valid")
    try:
        is_token_valid(request)
    except InvalidUsage as error:
        return jsonify(False)
    except Exception as error:
        raise InvalidUsage(f'Unable to check if token is valid: {error.__str__()}', 500)
    return jsonify(True)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """handle error of wrong usage on functions"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(AuthorizationError)
def handle_invalid_usage(error):
    """handle error of wrong usage on functions"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(BadRequestKeyError)
def handle_invalid_req_key(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': error.__str__()})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response


@app.errorhandler(KeyError)
def handle_invalid_req_key_header(error):
    """handle error of missed/wrong parameter"""
    response = jsonify({'message': f'{error.__str__()} missing'})
    response.status_code = 400
    traceback.print_tb(error.__traceback__)
    return response