import time
from functools import wraps
from pyspark.sql import SparkSession


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