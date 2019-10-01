import time
from functools import wraps
from pyspark.sql import SparkSession
from sqlalchemy import create_engine


def time_it(method):
    """decorator to measure time of execution"""
    @wraps(method)
    def _timed(*args, **kwargs):
        start = time.time()
        result = method(*args, **kwargs)
        end = time.time()
        print('method {} est: {}'.format(method.__name__, end - start))
        return result
    return _timed


def spark():
    """spark Session factory"""
    spark_ = SparkSession \
        .builder \
        .appName("Detect dictionary and vocabulary") \
        .getOrCreate()
    return spark_


class MetaSingleton(type):
    """Metaclass for singleton"""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(MetaSingleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Database(metaclass=MetaSingleton):
    """Database connection singleton based on sqlalchemy"""
    connection = None

    def get_engine(self, connection_string=None):
        if self.connection is None and connection_string is None:
            raise ValueError('Connection string missed')
        elif connection_string is None:
            return self.connection
        else:
            self.connection = create_engine(f'postgresql+pypostgresql://{connection_string}')
            return self.connection


