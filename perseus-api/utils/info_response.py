from flask import jsonify

from config import VERSION


def info_response():
    return jsonify({'name': 'Perseus', 'version': VERSION})