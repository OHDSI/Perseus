from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room
import logging
from app import app
from model.user.user import User

socket = SocketIO(app, cors_allowed_origins='*', async_mode="threading")
users_sids = {}


@socket.on('connect')
def connect():
    token = request.args['token']
    current_user = User.decode_auth_token(token)
    users_sids[current_user] = request.sid
    join_room(request.sid)
    logging.info(f"Client {current_user} connected")


@socket.on('disconnect')
def disconnect():
    sid = request.sid
    leave_room(sid)
    current_user = [k for k,v in users_sids.items() if v == sid][0]
    users_sids.pop(current_user, None)
    logging.info(f"Client {current_user} disconnected")


def emit_status(current_user, event, message, code):
    logging.info(message)
    sid = users_sids[current_user]
    socket.emit(event, {'message': message, 'status': {'code': code}}, to=sid)
