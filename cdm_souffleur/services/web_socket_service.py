from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room
from cdm_souffleur import app
import logging

socketio = SocketIO(app, cors_allowed_origins='*', async_mode="threading")
users_sids = {}


@socketio.on('connect')
def connect():
    print('Client connected')


@socketio.on('on_connected')
def on_connected(message):
    users_sids[message['data']] = request.sid
    join_room(request.sid)
    logging.info(f"Client {message['data']} connected")


@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')


@socketio.on('on_disconnected')
def on_disconnected(message):
    leave_room(request.sid)
    users_sids.pop(message['data'], None)
    logging.info(f"Client {message['data']} disconnected")


def emit_status(current_user, event, message, code):
    logging.info(message)
    sid = users_sids[current_user]
    socketio.emit(event, {'message': message, 'status': {'code': code}}, to=sid)
