from app import bcrypt, app


def decode_password(password: str) -> str:
    return bcrypt.generate_password_hash(
        password, app.config.get('BCRYPT_LOG_ROUNDS')
    ).decode()