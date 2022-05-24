from peewee import AutoField, CharField, DateTimeField
from model.baseModel import BaseModel


class BlacklistToken(BaseModel):
    id = AutoField()
    token = CharField(unique=True)
    blacklisted_on = DateTimeField()

    @staticmethod
    def check_blacklist(auth_token):
        blacklisted_token = BlacklistToken.select().where(BlacklistToken.token == auth_token)
        if blacklisted_token.exists():
            return True
        else:
            return False