from app import app
from config import PORT
from create_tables import create_usagi2_tables
from service.web_socket_service import socket
from usagi_api import usagi


app.register_blueprint(usagi)

if __name__ == '__main__':
    create_usagi2_tables()
    socket.run(app, port=PORT, host='0.0.0.0')