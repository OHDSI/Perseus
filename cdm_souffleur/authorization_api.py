from flask import request, jsonify, Blueprint
from cdm_souffleur.utils.exceptions import InvalidUsage
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


@authorization_api.route('/api/activate_user', methods=['GET'])
def activate_user():
    try:
        random_string = request.args['rnd_str']
        activate_user_in_db(random_string)
    except InvalidUsage as error:
        raise error
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(True)

@authorization_api.route('/api/login', methods=['POST'])
def login():
    try:
        email = request.json['username']
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

@authorization_api.route('/api/reset_password', methods=['POST'])
def reset_password():
    try:
        email = request.json['username']
        reset_password_for_user(email)
    except Exception as error:
        raise error
    return jsonify()