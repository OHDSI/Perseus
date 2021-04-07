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
        auth_token = register_user_in_db(password, first_name, last_name, email)
    except IntegrityError as error:
        raise InvalidUsage('This email already exists in database', 409)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 500)
    return jsonify(auth_token)


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