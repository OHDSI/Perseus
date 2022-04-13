class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code

    def to_dict(self):
        rv = dict()
        rv['message'] = self.message
        return rv


class WrongReportStructure(InvalidUsage):

    def __init__(self, message, status_code=None):
        Exception.__init__(self)
        self.message = f'Wrong structure of report file. {message}.'
        if status_code is not None:
            self.status_code = status_code
