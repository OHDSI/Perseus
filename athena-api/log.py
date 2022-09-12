import logging


class LevelFilter(logging.Filter):
    def __init__(self, max_level):
        self.max_level = max_level
        logging.Filter.__init__(self)

    def filter(self, record):
        if record.levelno <= self.max_level:
            return True
        return False
