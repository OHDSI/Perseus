from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room
from cdm_souffleur import app
import logging

from cdm_souffleur.model.user import User

socketio = SocketIO(app, cors_allowed_origins='*', async_mode="threading")
users_sids = {}


@socketio.on('connect')
def connect():
    token = request.args['token']
    current_user = User.decode_auth_token(token)
    users_sids[current_user] = request.sid
    join_room(request.sid)
    logging.info(f"Client {current_user} connected")


@socketio.on('disconnect')
def disconnect():
    sid = request.sid
    leave_room(sid)
    current_user = [k for k,v in users_sids.items() if v == sid][0]
    users_sids.pop(current_user, None)
    logging.info(f"Client {current_user} disconnected")


def emit_status(current_user, event, message, code):
    logging.info(message)
    sid = users_sids[current_user]
    socketio.emit(event, {'message': message, 'status': {'code': code}}, to=sid)
