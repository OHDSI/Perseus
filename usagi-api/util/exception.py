class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, base: Exception = None):
        Exception.__init__(self) \
            if base is None \
            else Exception.with_traceback(self, base.__traceback__)
        self.message = message
        if status_code is not None:
            self.status_code = status_code

    def to_dict(self):
        rv = dict()
        rv['message'] = self.message
        return rv

    def __str__(self):
        return self.message