from flask import request, jsonify, Blueprint
from cdm_souffleur.utils.exceptions import InvalidUsage
from cdm_souffleur.services.authorization_service import *

authorization_api = Blueprint('authorization_api', __name__)

@authorization_api.route('/api/login', methods=['POST'])
def login():
    try:
        username = request.json['username']
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify('OK')


@authorization_api.route('/api/register', methods=['POST'])
def register_user():
    try:
        username = request.json['username']
        password = request.json['password']
        auth_token = register_user_in_db(username, password)
    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify(auth_token)


@authorization_api.route('/api/register', methods=['POST'])
def register():
    try:
        source_tables = request.json

    except Exception as error:
        raise InvalidUsage(error.__str__(), 404)
    return jsonify('OK')