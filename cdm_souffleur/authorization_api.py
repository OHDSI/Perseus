from flask import request, jsonify, Blueprint
from cdm_souffleur.utils.exceptions import InvalidUsage
from cdm_souffleur.services.authorization_service import *

authorization_api = Blueprint('authorization_api', __name__)


@authorization_api.route('/api/register', methods=['POST'])
def register_user():
    try:
        username = request.json['username']
        password = request.json['password']
        first_name = request.json['first_name'] if 'first_name' in request.json else None
        last_name = request.json['last_name'] if 'last_name' in request.json else None
        email = request.json['email'] if 'email' in request.json else None
        auth_token = register_user_in_db(username, password, first_name, last_name, email)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(auth_token)


@authorization_api.route('/api/login', methods=['POST'])
def login():
    try:
        username = request.json['username']
        password = request.json['password']
        auth_token = user_login(username, password)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(auth_token)

@authorization_api.route('/api/logout', methods=['POST'])
@token_required
def logout():
    try:
        auth_token = user_logout()
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(auth_token)