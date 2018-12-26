import time


def time_it(method):
    """decorator to measure time of execution"""
    def timed(*args, **kwargs):
        start = time.time()
        result = method(*args, **kwargs)
        end = time.time()
        print('method {} est:{}'.format(method.__name__, end - start))
        return result
    return timed