from peewee import AutoField, CharField, DateTimeField

from model.baseModel import BaseModel


class blacklist_token(BaseModel):
    id = AutoField()
    token = CharField(unique=True)
    blacklisted_on = DateTimeField()

    @staticmethod
    def check_blacklist(auth_token):
        blacklisted_token = blacklist_token.select().where(blacklist_token.token == auth_token)
        if blacklisted_token.exists():
            return True
        else:
            return False