from flask import request, jsonify, Blueprint
from werkzeug.utils import redirect
from cdm_souffleur.services.authorization_service import *

authorization_api = Blueprint('authorization_api', __name__)


@authorization_api.route('/api/register', methods=['POST'])
def register_user():
    try:
        password = request.json['password']
        first_name = request.json['firstName']
        last_name = request.json['lastName']
        email = request.json['email']
        register_user_in_db(password, first_name, last_name, email)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(True)


@authorization_api.route('/api/confirm_registration', methods=['GET'])
def confirm_registration():
    try:
        random_string = request.args['token']
        activate_user_in_db(random_string)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return redirect(f"http://{app.config['SERVER_HOST']}", code=302)


@authorization_api.route('/api/login', methods=['POST'])
def login():
    try:
        email = request.json['email']
        password = request.json['password']
        auth_token = user_login(email, password)
    except InvalidUsage as error:
        raise error
    except AuthorizationError as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(auth_token)


@authorization_api.route('/api/logout', methods=['GET'])
@token_required
def logout(current_user):
    try:
        user_logout(request.headers['Authorization'])
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify()


@authorization_api.route('/api/recover-password', methods=['POST'])
def reset_password_request():
    try:
        email = request.json['email']
        send_reset_password_email(email)
    except Exception as error:
        raise error
    return jsonify(True)


@authorization_api.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        new_pwd = request.json['password']
        random_string = request.json['token']
        reset_password_for_user(new_pwd, random_string)
    except Exception as error:
        raise error
    return jsonify(True)


@authorization_api.route('/api/register_unauthorized_reset_pwd_request', methods=['GET'])
def register_unauthorized_reset_pwd():
    try:
        user_key = request.args['token']
        register_unauthorized_reset_pwd_in_db(user_key)
    except Exception as error:
        raise error
    return redirect(f"{app.config['SERVER_HOST']}", code=302)