from flask import Request
from util.exception import InvalidUsage


def get_conversion_id(request: Request):
    conversion_id = request.args.get('conversionId', None, int)
    if conversion_id is None:
        raise InvalidUsage('Invalid conversion id', 400)
    return conversion_id